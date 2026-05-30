#!/usr/bin/env python3
"""Apply reviewer-comment revisions to the thesis DOCX.

The review system cannot create PRs that contain generated DOCX binary diffs, so
this script keeps the changes reviewable as text. Run it locally to generate the
revised DOCX while preserving the original Word comments.

The two commented diagram paragraphs are regenerated as PNG media, not SVG, so
Word/WPS can open the output reliably. The function-structure diagram is rebuilt
as a real left-to-right layout, and the detailed-flow diagram is rebuilt as a
vertical flow so neither image is squeezed into an unreadable strip.
"""

import argparse
import os
import shutil
import struct
import tempfile
import zipfile
import zlib
from pathlib import Path
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
WP = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
REL = "http://schemas.openxmlformats.org/package/2006/relationships"

NS = {"w": W, "r": R, "a": A, "wp": WP, "rel": REL}
for prefix, uri in [("w", W), ("r", R), ("a", A), ("wp", WP)]:
    ET.register_namespace(prefix, uri)
ET.register_namespace("", REL)

DEFAULT_SOURCE = Path("2425_41_10475_080902_6020222035_LW. (1).docx")
DEFAULT_OUTPUT = Path("2425_41_10475_080902_6020222035_LW_批注修改版.docx")

TEACHER_DESCRIPTION = (
    "学生角色完成选课全流程，包括课程查询、智能推荐、在线选课、冲突检测、课表查看和选课消息接收；"
    "教师角色负责课程发布与课程信息维护，可查看选课名单和课程容量情况，并根据教学安排提交课程调整需求；"
    "管理员角色负责学生、教师和课程基础数据维护、课程审核、选课规则配置、名额调整、系统监控和异常处理，"
    "以保障选课业务稳定运行。系统用户综合用例图如图 3-2所示。"
)

TARGET_STYLE_IDS = ["ThesisHeading1", "ThesisHeading2", "ThesisHeading3", "ThesisCaption"]
DIAGRAM_EXTENTS = {
    "media/image6.png": ("5040000", "2713846"),
    "media/image8.png": ("4320000", "5981538"),
}
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
WHITE_PIXEL = (255, 255, 255, 255)
BLACK_PIXEL = (0, 0, 0, 255)

# Crop boxes are taken from the two original commented diagrams. Reusing their
# rendered labels avoids relying on system CJK fonts while still rebuilding the
# layout requested by the comments.
FUNCTION_CROPS = {
    "root": (1436, 10, 1701, 67),
    "student": (503, 119, 606, 174),
    "teacher": (1256, 119, 1359, 174),
    "admin": (1681, 119, 1811, 174),
    "support": (2400, 119, 2523, 174),
    "course_query": (7, 219, 128, 274),
    "recommend": (169, 219, 290, 274),
    "select_course": (330, 219, 451, 274),
    "conflict": (491, 219, 612, 274),
    "schedule": (654, 219, 803, 274),
    "message": (833, 219, 954, 274),
    "publish": (994, 219, 1116, 274),
    "maintain": (1156, 219, 1278, 274),
    "roster": (1318, 219, 1470, 274),
    "student_mgmt": (1518, 219, 1640, 274),
    "teacher_mgmt": (1678, 219, 1800, 274),
    "course_audit": (1839, 219, 1961, 274),
    "quota": (2002, 219, 2124, 274),
    "auth": (2157, 219, 2283, 274),
    "gateway": (2319, 219, 2441, 274),
    "load": (2476, 219, 2600, 274),
    "async": (2636, 219, 2759, 274),
    "log": (2801, 219, 2922, 274),
}


TEXT_CROP_OVERRIDES = {
    "root": (1458, 23, 1682, 50),
    "admin": (1696, 132, 1776, 164),
    "deliver": (880, 24, 1008, 52),
    "write": (1295, 126, 1422, 154),
}

FLOW_CROPS = {
    "login": (10, 12, 119, 65),
    "gateway": (168, 12, 314, 65),
    "recommend": (363, 12, 472, 65),
    "query": (520, 12, 667, 65),
    "precheck": (716, 12, 824, 65),
    "deliver": (873, 12, 1019, 65),
    "lock": (871, 112, 1020, 166),
    "validate": (1068, 112, 1233, 166),
    "write": (1280, 112, 1460, 166),
    "notify": (1477, 112, 1621, 166),
    "refresh": (1669, 112, 1800, 166),
    "failure": (1313, 83, 1419, 108),
}


def qn(uri: str, tag: str) -> str:
    return f"{{{uri}}}{tag}"


def paragraph_text(paragraph: ET.Element) -> str:
    return "".join(text.text or "" for text in paragraph.findall(".//w:t", NS))


def replace_paragraph_text(paragraph: ET.Element, text: str) -> bool:
    text_nodes = paragraph.findall(".//w:t", NS)
    if not text_nodes:
        return False
    text_nodes[0].text = text
    for text_node in text_nodes[1:]:
        text_node.text = ""
    return True


def paeth_predictor(left: int, above: int, upper_left: int) -> int:
    estimate = left + above - upper_left
    left_distance = abs(estimate - left)
    above_distance = abs(estimate - above)
    upper_left_distance = abs(estimate - upper_left)
    if left_distance <= above_distance and left_distance <= upper_left_distance:
        return left
    if above_distance <= upper_left_distance:
        return above
    return upper_left


def decode_png_rgba(data: bytes) -> tuple[int, int, list[bytearray]]:
    if not data.startswith(PNG_SIGNATURE):
        raise RuntimeError("Expected PNG media.")
    pos = len(PNG_SIGNATURE)
    width = height = bit_depth = color_type = None
    compressed = bytearray()
    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        chunk_type = data[pos + 4 : pos + 8]
        chunk_data = data[pos + 8 : pos + 8 + length]
        pos += length + 12
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, compression, png_filter, interlace = struct.unpack(">IIBBBBB", chunk_data)
            if bit_depth != 8 or compression != 0 or png_filter != 0 or interlace != 0:
                raise RuntimeError("Unsupported PNG format for diagram rebuilding.")
            if color_type not in (2, 6):
                raise RuntimeError("Only truecolor PNG diagrams are supported.")
        elif chunk_type == b"IDAT":
            compressed.extend(chunk_data)
        elif chunk_type == b"IEND":
            break
    if width is None or height is None:
        raise RuntimeError("PNG is missing an IHDR chunk.")

    channels = 4 if color_type == 6 else 3
    stride = width * channels
    raw = zlib.decompress(bytes(compressed))
    rows: list[bytearray] = []
    src = 0
    previous = bytearray(stride)
    for _ in range(height):
        filter_type = raw[src]
        src += 1
        row = bytearray(raw[src : src + stride])
        src += stride
        for i, value in enumerate(row):
            left = row[i - channels] if i >= channels else 0
            above = previous[i]
            upper_left = previous[i - channels] if i >= channels else 0
            if filter_type == 1:
                row[i] = (value + left) & 0xFF
            elif filter_type == 2:
                row[i] = (value + above) & 0xFF
            elif filter_type == 3:
                row[i] = (value + ((left + above) // 2)) & 0xFF
            elif filter_type == 4:
                row[i] = (value + paeth_predictor(left, above, upper_left)) & 0xFF
            elif filter_type != 0:
                raise RuntimeError(f"Unsupported PNG filter: {filter_type}")
        if color_type == 2:
            rgba = bytearray()
            for i in range(0, len(row), 3):
                rgba.extend((row[i], row[i + 1], row[i + 2], 255))
            row = rgba
        rows.append(row)
        previous = row if channels == 4 else bytearray(raw_channel for px in range(width) for raw_channel in row[px * 4 : px * 4 + 3])
    return width, height, rows


def encode_png_rgba(width: int, height: int, rows: list[bytearray]) -> bytes:
    def chunk(kind: bytes, payload: bytes) -> bytes:
        return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", zlib.crc32(kind + payload) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    raw = bytearray()
    for row in rows:
        raw.append(0)
        raw.extend(row)
    return PNG_SIGNATURE + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")


def blank_canvas(width: int, height: int) -> list[bytearray]:
    return [bytearray(WHITE_PIXEL * width) for _ in range(height)]


def crop(rows: list[bytearray], box: tuple[int, int, int, int]) -> tuple[int, int, list[bytearray]]:
    left, top, right, bottom = box
    cropped = [bytearray(row[left * 4 : right * 4]) for row in rows[top:bottom]]
    return right - left, bottom - top, cropped


def scale_image(rows: list[bytearray], width: int, height: int, scale: int) -> tuple[int, int, list[bytearray]]:
    scaled_width = width * scale
    scaled_rows: list[bytearray] = []
    for row in rows:
        scaled_row = bytearray()
        for x in range(width):
            pixel = row[x * 4 : x * 4 + 4]
            scaled_row.extend(pixel * scale)
        for _ in range(scale):
            scaled_rows.append(bytearray(scaled_row))
    return scaled_width, height * scale, scaled_rows


def paste(canvas: list[bytearray], image: list[bytearray], x: int, y: int) -> None:
    canvas_width = len(canvas[0]) // 4
    for row_index, row in enumerate(image):
        target_y = y + row_index
        if not 0 <= target_y < len(canvas):
            continue
        image_width = len(row) // 4
        source_left = max(0, -x)
        source_right = min(image_width, canvas_width - x)
        if source_left >= source_right:
            continue
        target_left = x + source_left
        target_right = x + source_right
        canvas[target_y][target_left * 4 : target_right * 4] = row[source_left * 4 : source_right * 4]


def set_pixel(canvas: list[bytearray], x: int, y: int, color: tuple[int, int, int, int] = BLACK_PIXEL) -> None:
    if 0 <= y < len(canvas) and 0 <= x < len(canvas[0]) // 4:
        canvas[y][x * 4 : x * 4 + 4] = bytes(color)


def draw_line(canvas: list[bytearray], start: tuple[int, int], end: tuple[int, int], thickness: int = 3) -> None:
    x1, y1 = start
    x2, y2 = end
    dx = abs(x2 - x1)
    dy = -abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    error = dx + dy
    while True:
        for oy in range(-(thickness // 2), thickness // 2 + 1):
            for ox in range(-(thickness // 2), thickness // 2 + 1):
                set_pixel(canvas, x1 + ox, y1 + oy)
        if x1 == x2 and y1 == y2:
            break
        double_error = 2 * error
        if double_error >= dy:
            error += dy
            x1 += sx
        if double_error <= dx:
            error += dx
            y1 += sy


def draw_arrow(canvas: list[bytearray], start: tuple[int, int], end: tuple[int, int]) -> None:
    draw_line(canvas, start, end, 3)
    x1, y1 = start
    x2, y2 = end
    if abs(x2 - x1) >= abs(y2 - y1):
        direction = 1 if x2 >= x1 else -1
        points = [(x2, y2), (x2 - 18 * direction, y2 - 10), (x2 - 18 * direction, y2 + 10)]
    else:
        direction = 1 if y2 >= y1 else -1
        points = [(x2, y2), (x2 - 10, y2 - 18 * direction), (x2 + 10, y2 - 18 * direction)]
    fill_triangle(canvas, points)


def fill_triangle(canvas: list[bytearray], points: list[tuple[int, int]]) -> None:
    min_x = max(min(x for x, _ in points), 0)
    max_x = min(max(x for x, _ in points), len(canvas[0]) // 4 - 1)
    min_y = max(min(y for _, y in points), 0)
    max_y = min(max(y for _, y in points), len(canvas) - 1)
    (x1, y1), (x2, y2), (x3, y3) = points
    denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
    if denom == 0:
        return
    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denom
            b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denom
            c = 1 - a - b
            if a >= 0 and b >= 0 and c >= 0:
                set_pixel(canvas, x, y)


def prepare_text_assets(source_rows: list[bytearray], boxes: dict[str, tuple[int, int, int, int]], scale: int) -> dict[str, tuple[int, int, list[bytearray]]]:
    assets = {}
    for name, (left, top, right, bottom) in boxes.items():
        if name in TEXT_CROP_OVERRIDES:
            text_box = TEXT_CROP_OVERRIDES[name]
        else:
            inset_x = 18 if (right - left) > 130 else 14
            inset_y = 13 if (bottom - top) > 45 else 10
            if name == "failure":
                inset_x = 22
                inset_y = 10
            text_box = (left + inset_x, top + inset_y, right - inset_x, bottom - inset_y)
        width, height, cropped = crop(source_rows, text_box)
        assets[name] = scale_image(cropped, width, height, scale)
    return assets


def prepare_box_assets(source_rows: list[bytearray], boxes: dict[str, tuple[int, int, int, int]], scale: int) -> dict[str, tuple[int, int, list[bytearray]]]:
    assets = {}
    for name, box in boxes.items():
        width, height, cropped = crop(source_rows, box)
        assets[name] = scale_image(cropped, width, height, scale)
    return assets


def draw_rect(canvas: list[bytearray], x: int, y: int, width: int, height: int, thickness: int = 4) -> None:
    # White-fill first so connector lines never show through the label box.
    canvas_width = len(canvas[0]) // 4
    for yy in range(max(0, y), min(len(canvas), y + height)):
        for xx in range(max(0, x), min(canvas_width, x + width)):
            set_pixel(canvas, xx, yy, WHITE_PIXEL)
    for offset in range(thickness):
        for xx in range(x + offset, x + width - offset):
            set_pixel(canvas, xx, y + offset)
            set_pixel(canvas, xx, y + height - 1 - offset)
        for yy in range(y + offset, y + height - offset):
            set_pixel(canvas, x + offset, yy)
            set_pixel(canvas, x + width - 1 - offset, yy)


def paste_centered(canvas: list[bytearray], asset: tuple[int, int, list[bytearray]], center: tuple[int, int]) -> tuple[int, int, int, int]:
    width, height, rows = asset
    x = center[0] - width // 2
    y = center[1] - height // 2
    paste(canvas, rows, x, y)
    return x, y, width, height


def draw_label(canvas: list[bytearray], asset: tuple[int, int, list[bytearray]], center: tuple[int, int], padding_x: int = 36, padding_y: int = 24) -> tuple[int, int, int, int]:
    text_width, text_height, rows = asset
    box_width = text_width + padding_x * 2
    box_height = text_height + padding_y * 2
    box_x = center[0] - box_width // 2
    box_y = center[1] - box_height // 2
    draw_rect(canvas, box_x, box_y, box_width, box_height)
    paste(canvas, rows, center[0] - text_width // 2, center[1] - text_height // 2)
    return box_x, box_y, box_width, box_height


def edge(box: tuple[int, int, int, int], side: str) -> tuple[int, int]:
    x, y, width, height = box
    if side == "left":
        return x, y + height // 2
    if side == "right":
        return x + width, y + height // 2
    if side == "top":
        return x + width // 2, y
    if side == "bottom":
        return x + width // 2, y + height
    raise ValueError(side)


def rebuild_function_structure_png(original_png: bytes) -> bytes:
    _, _, source_rows = decode_png_rgba(original_png)
    assets = prepare_text_assets(source_rows, FUNCTION_CROPS, scale=2)
    canvas = blank_canvas(2600, 1400)

    positions = {
        "root": (330, 700),
        "student": (820, 220),
        "teacher": (820, 500),
        "admin": (820, 780),
        "support": (820, 1100),
        "course_query": (1200, 105),
        "recommend": (1600, 105),
        "select_course": (2000, 105),
        "conflict": (1200, 265),
        "schedule": (1600, 265),
        "message": (2000, 265),
        "publish": (1200, 445),
        "maintain": (1600, 445),
        "roster": (2000, 445),
        "student_mgmt": (1200, 700),
        "teacher_mgmt": (1600, 700),
        "course_audit": (2000, 700),
        "quota": (1600, 860),
        "auth": (1120, 1060),
        "gateway": (1460, 1060),
        "load": (1800, 1060),
        "async": (1320, 1230),
        "log": (1660, 1230),
    }

    for role in ["student", "teacher", "admin", "support"]:
        draw_arrow(canvas, (620, 700), (690, positions[role][1]))
    for target in ["course_query", "recommend", "select_course", "conflict", "schedule", "message"]:
        draw_arrow(canvas, (940, 220), (1040, positions[target][1]))
    for target in ["publish", "maintain", "roster"]:
        draw_arrow(canvas, (940, 500), (1040, positions[target][1]))
    for target in ["student_mgmt", "teacher_mgmt", "course_audit", "quota"]:
        draw_arrow(canvas, (950, 780), (1040, positions[target][1]))
    for target in ["auth", "gateway", "load", "async", "log"]:
        draw_arrow(canvas, (950, 1100), (990, positions[target][1]))

    for name, center in positions.items():
        boxes_padding_x = 54 if name == "root" else 42
        draw_label(canvas, assets[name], center, padding_x=boxes_padding_x, padding_y=30)
    return encode_png_rgba(2600, 1400, canvas)

def rebuild_detailed_flow_png(original_png: bytes) -> bytes:
    _, _, source_rows = decode_png_rgba(original_png)
    assets = prepare_text_assets(source_rows, FLOW_CROPS, scale=2)
    canvas = blank_canvas(1300, 1800)
    sequence = [
        "login",
        "gateway",
        "recommend",
        "query",
        "precheck",
        "deliver",
        "lock",
        "validate",
        "write",
        "notify",
        "refresh",
    ]
    positions = {name: (650, 110 + index * 150) for index, name in enumerate(sequence)}
    boxes: dict[str, tuple[int, int, int, int]] = {}
    # Estimate boxes first so arrows can be routed to edges, then repaint labels
    # on top to keep every node clean and readable.
    for name, center in positions.items():
        text_width, text_height, _ = assets[name]
        boxes[name] = (center[0] - (text_width + 88) // 2, center[1] - (text_height + 60) // 2, text_width + 88, text_height + 60)
    for previous, current in zip(sequence, sequence[1:]):
        draw_arrow(canvas, edge(boxes[previous], "bottom"), edge(boxes[current], "top"))
    for name, center in positions.items():
        draw_label(canvas, assets[name], center, padding_x=44, padding_y=30)
    return encode_png_rgba(1300, 1800, canvas)

def read_package(docx_path: Path) -> tuple[dict[str, bytes], list[str]]:
    with zipfile.ZipFile(docx_path, "r") as docx:
        names = [info.filename for info in docx.infolist()]
        return {name: docx.read(name) for name in names}, names


def update_document(entries: dict[str, bytes]) -> None:
    document = ET.fromstring(entries["word/document.xml"])
    rels = ET.fromstring(entries["word/_rels/document.xml.rels"])
    rel_targets = {rel.get("Id"): rel.get("Target") for rel in rels.findall("rel:Relationship", NS)}

    replaced_teacher_description = False
    resized_diagrams: set[str] = set()

    for paragraph in document.findall(".//w:p", NS):
        if paragraph_text(paragraph).startswith("学生角色完成选课全流程"):
            replaced_teacher_description = replace_paragraph_text(paragraph, TEACHER_DESCRIPTION)

        blips = paragraph.findall(".//a:blip", NS)
        if not blips:
            continue
        target = rel_targets.get(blips[0].get(qn(R, "embed")))
        extent = paragraph.find(".//wp:extent", NS)
        if target in DIAGRAM_EXTENTS and extent is not None:
            cx, cy = DIAGRAM_EXTENTS[target]
            extent.set("cx", cx)
            extent.set("cy", cy)
            resized_diagrams.add(target)

    if not replaced_teacher_description:
        raise RuntimeError("Could not find the paragraph that describes the student role.")
    missing_diagrams = set(DIAGRAM_EXTENTS) - resized_diagrams
    if missing_diagrams:
        missing = ", ".join(sorted(missing_diagrams))
        raise RuntimeError(f"Could not find expected diagram image(s): {missing}")

    entries["word/document.xml"] = ET.tostring(document, encoding="utf-8", xml_declaration=True)


def update_styles(entries: dict[str, bytes]) -> None:
    styles = ET.fromstring(entries["word/styles.xml"])
    for style_id in TARGET_STYLE_IDS:
        style = styles.find(f".//w:style[@w:styleId='{style_id}']", NS)
        if style is None:
            continue
        paragraph_properties = style.find("w:pPr", NS)
        if paragraph_properties is None:
            paragraph_properties = ET.SubElement(style, qn(W, "pPr"))
        spacing = paragraph_properties.find("w:spacing", NS)
        if spacing is None:
            spacing = ET.SubElement(paragraph_properties, qn(W, "spacing"))
        spacing.set(qn(W, "before"), "0")
        spacing.set(qn(W, "after"), "0")
    entries["word/styles.xml"] = ET.tostring(styles, encoding="utf-8", xml_declaration=True)


def update_settings(entries: dict[str, bytes]) -> None:
    settings = ET.fromstring(entries["word/settings.xml"])
    update_fields = settings.find("w:updateFields", NS)
    if update_fields is None:
        update_fields = ET.Element(qn(W, "updateFields"))
        settings.insert(0, update_fields)
    update_fields.set(qn(W, "val"), "true")
    entries["word/settings.xml"] = ET.tostring(settings, encoding="utf-8", xml_declaration=True)


def update_diagram_media(entries: dict[str, bytes]) -> None:
    entries["word/media/image6.png"] = rebuild_function_structure_png(entries["word/media/image6.png"])
    entries["word/media/image8.png"] = rebuild_detailed_flow_png(entries["word/media/image8.png"])


def assert_relationship_targets_exist(entries: dict[str, bytes]) -> None:
    rels = ET.fromstring(entries["word/_rels/document.xml.rels"])
    missing_targets: list[str] = []
    for rel in rels.findall("rel:Relationship", NS):
        target = rel.get("Target") or ""
        if target.startswith(("http://", "https://", "mailto:")) or target.startswith("../"):
            continue
        if target.startswith("/"):
            package_name = target.lstrip("/")
        else:
            package_name = f"word/{target}"
        if package_name not in entries and not target.startswith("#"):
            missing_targets.append(target)
    if missing_targets:
        missing = ", ".join(sorted(missing_targets))
        raise RuntimeError(f"Generated DOCX has relationship targets that do not exist: {missing}")


def png_dimensions(data: bytes) -> tuple[int, int]:
    if not data.startswith(PNG_SIGNATURE):
        raise RuntimeError("Expected PNG data.")
    return struct.unpack(">II", data[16:24])


def write_package(entries: dict[str, bytes], original_order: list[str], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(suffix=".docx", dir=str(output_path.parent or Path(".")))
    os.close(fd)
    try:
        with zipfile.ZipFile(temp_name, "w", compression=zipfile.ZIP_DEFLATED) as docx:
            written = set()
            for name in original_order:
                docx.writestr(name, entries[name])
                written.add(name)
            for name in sorted(set(entries) - written):
                docx.writestr(name, entries[name])
        shutil.move(temp_name, output_path)
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)


def verify_output(output_path: Path) -> None:
    with zipfile.ZipFile(output_path, "r") as docx:
        bad_member = docx.testzip()
        if bad_member is not None:
            raise RuntimeError(f"Generated DOCX is corrupt at member: {bad_member}")
        comments = ET.fromstring(docx.read("word/comments.xml")).findall(".//w:comment", NS)
        if len(comments) != 6:
            raise RuntimeError(f"Expected 6 retained comments, found {len(comments)}")
        names = set(docx.namelist())
        if any(name.endswith(".svg") for name in names):
            raise RuntimeError("Generated DOCX unexpectedly contains SVG media; use PNG media for compatibility.")
        image6_size = png_dimensions(docx.read("word/media/image6.png"))
        image8_size = png_dimensions(docx.read("word/media/image8.png"))
        if image6_size != (2600, 1400):
            raise RuntimeError(f"Expected rebuilt function-structure diagram to be 2600x1400, got {image6_size}.")
        if image8_size != (1300, 1800):
            raise RuntimeError(f"Expected rebuilt detailed-flow diagram to be 1300x1800, got {image8_size}.")


def apply_revisions(source_path: Path, output_path: Path) -> None:
    entries, original_order = read_package(source_path)
    update_diagram_media(entries)
    update_document(entries)
    update_styles(entries)
    update_settings(entries)
    assert_relationship_targets_exist(entries)
    write_package(entries, original_order, output_path)
    verify_output(output_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate the reviewer-comment revised thesis DOCX.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Source DOCX with original comments.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Generated revised DOCX path.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    apply_revisions(args.source, args.output)
    print(f"Generated revised DOCX: {args.output}")


if __name__ == "__main__":
    main()
