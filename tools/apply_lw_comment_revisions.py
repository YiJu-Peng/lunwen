#!/usr/bin/env python3
"""Apply reviewer-comment revisions to the thesis DOCX.

The review system cannot create PRs that contain generated DOCX binary diffs, so
this script keeps the changes reviewable as text. Run it locally to generate the
revised DOCX while preserving the original Word comments.

Compatibility note: the script keeps the original PNG diagram media in place.
Earlier versions swapped those relationships to SVG files, but some Word/WPS
readers report a generic input/output error when opening such DOCX packages.
Keeping PNG relationships avoids that reader compatibility problem.
"""

import argparse
import os
import shutil
import tempfile
import zipfile
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
    "media/image6.png": ("5040000", "2835000"),
    "media/image8.png": ("4320000", "6480000"),
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


def apply_revisions(source_path: Path, output_path: Path) -> None:
    entries, original_order = read_package(source_path)
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
