#!/usr/bin/env python3
"""Apply reviewer-comment revisions to the thesis DOCX without storing binary diffs.

The repository review system cannot create PRs that contain binary DOCX diffs, so
this script keeps the change reviewable as text. Run it to generate the revised
DOCX while preserving the original Word comments.
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
CT = "http://schemas.openxmlformats.org/package/2006/content-types"
REL = "http://schemas.openxmlformats.org/package/2006/relationships"

NS = {"w": W, "r": R, "a": A, "wp": WP, "ct": CT, "rel": REL}
for prefix, uri in [("w", W), ("r", R), ("a", A), ("wp", WP), ("ct", CT)]:
    ET.register_namespace(prefix, uri)
ET.register_namespace("", REL)

DEFAULT_SOURCE = Path("2425_41_10475_080902_6020222035_LW. (1).docx")
DEFAULT_OUTPUT = Path("2425_41_10475_080902_6020222035_LW_批注修改版.docx")


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


FUNCTION_STRUCTURE_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <style><![CDATA[
      text { font-family: "Noto Sans CJK SC", "Microsoft YaHei", "SimSun", sans-serif; fill:#111; }
      .title { font-size:34px; font-weight:700; }
      .role { font-size:26px; font-weight:700; }
      .item { font-size:22px; }
      .box { fill:#fff; stroke:#111; stroke-width:2.5; rx:16; ry:16; }
      .root { fill:#f2f6ff; stroke:#111; stroke-width:3; rx:20; ry:20; }
      .line { stroke:#111; stroke-width:2.4; fill:none; marker-end:url(#arrow); }
    ]]></style>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M2,2 L10,6 L2,10 Z" fill="#111"/>
    </marker>
  </defs>
  <rect x="1" y="1" width="1598" height="898" fill="white"/>
  <rect class="root" x="55" y="385" width="260" height="90"/>
  <text class="title" x="185" y="438" text-anchor="middle">高校智能选课系统</text>
  <g transform="translate(400,75)"><rect class="box" width="210" height="80"/><text class="role" x="105" y="50" text-anchor="middle">学生端</text></g>
  <g transform="translate(400,295)"><rect class="box" width="210" height="80"/><text class="role" x="105" y="50" text-anchor="middle">教师端</text></g>
  <g transform="translate(400,515)"><rect class="box" width="210" height="80"/><text class="role" x="105" y="50" text-anchor="middle">管理员端</text></g>
  <g transform="translate(400,735)"><rect class="box" width="210" height="80"/><text class="role" x="105" y="50" text-anchor="middle">公共支撑</text></g>
  <path class="line" d="M315,430 C355,430 355,115 400,115"/><path class="line" d="M315,430 C355,430 355,335 400,335"/>
  <path class="line" d="M315,430 C355,430 355,555 400,555"/><path class="line" d="M315,430 C355,430 355,775 400,775"/>
  <g transform="translate(705,35)">
    <rect class="box" width="185" height="62"/><text class="item" x="92.5" y="39" text-anchor="middle">课程查询</text>
    <rect class="box" x="210" width="185" height="62"/><text class="item" x="302.5" y="39" text-anchor="middle">智能推荐</text>
    <rect class="box" x="420" width="185" height="62"/><text class="item" x="512.5" y="39" text-anchor="middle">在线选课</text>
    <rect class="box" x="630" width="185" height="62"/><text class="item" x="722.5" y="39" text-anchor="middle">冲突检测</text>
    <rect class="box" x="210" y="84" width="185" height="62"/><text class="item" x="302.5" y="123" text-anchor="middle">我的课程表</text>
    <rect class="box" x="420" y="84" width="185" height="62"/><text class="item" x="512.5" y="123" text-anchor="middle">消息中心</text>
  </g>
  <g transform="translate(705,282)">
    <rect class="box" width="210" height="62"/><text class="item" x="105" y="39" text-anchor="middle">课程发布</text>
    <rect class="box" x="240" width="210" height="62"/><text class="item" x="345" y="39" text-anchor="middle">课程维护</text>
    <rect class="box" x="480" width="240" height="62"/><text class="item" x="600" y="39" text-anchor="middle">查看选课名单</text>
  </g>
  <g transform="translate(705,502)">
    <rect class="box" width="185" height="62"/><text class="item" x="92.5" y="39" text-anchor="middle">学生管理</text>
    <rect class="box" x="210" width="185" height="62"/><text class="item" x="302.5" y="39" text-anchor="middle">教师管理</text>
    <rect class="box" x="420" width="185" height="62"/><text class="item" x="512.5" y="39" text-anchor="middle">课程审核</text>
    <rect class="box" x="630" width="185" height="62"/><text class="item" x="722.5" y="39" text-anchor="middle">名额调整</text>
  </g>
  <g transform="translate(705,690)">
    <rect class="box" width="185" height="62"/><text class="item" x="92.5" y="39" text-anchor="middle">统一鉴权</text>
    <rect class="box" x="210" width="185" height="62"/><text class="item" x="302.5" y="39" text-anchor="middle">网关路由</text>
    <rect class="box" x="420" width="185" height="62"/><text class="item" x="512.5" y="39" text-anchor="middle">负载均衡</text>
    <rect class="box" x="105" y="84" width="185" height="62"/><text class="item" x="197.5" y="123" text-anchor="middle">异步消息</text>
    <rect class="box" x="315" y="84" width="185" height="62"/><text class="item" x="407.5" y="123" text-anchor="middle">日志记录</text>
  </g>
  <path class="line" d="M610,115 L705,66"/><path class="line" d="M610,335 L705,313"/><path class="line" d="M610,555 L705,533"/><path class="line" d="M610,775 L705,721"/>
</svg>'''

DETAILED_FLOW_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
  <defs>
    <style><![CDATA[
      text { font-family: "Noto Sans CJK SC", "Microsoft YaHei", "SimSun", sans-serif; fill:#111; }
      .box { fill:#fff; stroke:#111; stroke-width:3; rx:18; ry:18; }
      .main { font-size:30px; font-weight:700; }
      .note { font-size:22px; fill:#333; }
      .line { stroke:#111; stroke-width:3; fill:none; marker-end:url(#arrow); }
      .dash { stroke-dasharray:12 10; }
    ]]></style>
    <marker id="arrow" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto" markerUnits="strokeWidth"><path d="M2,2 L12,7 L2,12 Z" fill="#111"/></marker>
  </defs>
  <rect x="1" y="1" width="998" height="1498" fill="white"/>
  <g transform="translate(280,35)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">用户登录</text></g>
  <path class="line" d="M500,123 L500,183"/>
  <g transform="translate(280,183)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">Gateway 鉴权</text></g>
  <path class="line" d="M500,271 L500,331"/>
  <g transform="translate(280,331)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">课程推荐</text></g>
  <path class="line" d="M500,419 L500,479"/>
  <g transform="translate(280,479)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">查询候选课程</text></g>
  <path class="line" d="M500,567 L500,627"/>
  <g transform="translate(280,627)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">冲突预检</text></g>
  <path class="line" d="M500,715 L500,775"/>
  <g transform="translate(280,775)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">投递选课消息</text></g>
  <path class="line" d="M500,863 L500,923"/>
  <g transform="translate(280,923)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">Redisson 加锁</text></g>
  <path class="line" d="M500,1011 L500,1071"/>
  <g transform="translate(280,1071)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">库存与重复校验</text></g>
  <path class="line" d="M500,1159 L500,1219"/>
  <g transform="translate(280,1219)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">写入选课记录</text></g>
  <path class="line" d="M500,1307 L500,1367"/>
  <g transform="translate(280,1367)"><rect class="box" width="440" height="88"/><text class="main" x="220" y="56" text-anchor="middle">通知消息中心</text></g>
  <path class="line dash" d="M720,1115 C885,1115 885,1411 720,1411"/><text class="note" x="840" y="1260" text-anchor="middle">失败原因</text>
  <path class="line" d="M720,1411 L805,1411 L805,1470 L500,1470 L500,1455"/><text class="note" x="500" y="1490" text-anchor="middle">消息处理后刷新课程表</text>
</svg>'''

TEACHER_DESCRIPTION = (
    "学生角色完成选课全流程：通过多条件筛选定位目标课程，系统在提交选课前自动执行时间冲突检测并以弹窗展示检测结果，"
    "学生确认无冲突后提交，系统异步处理后通过消息中心推送选课结果；课后可通过课表页面管理已选课程。"
    "教师角色主要负责课程发布与维护、查看课程选课名单、处理课程容量与时间安排等教学管理事项，并在课程信息调整后将变更同步给学生端。"
    "管理员角色负责学生、教师、课程等基础数据维护以及课程审核，确保不同角色在统一鉴权体系下完成各自业务。用户综合用例图如图 3-2所示。"
)


def read_package(docx_path: Path) -> tuple[dict[str, bytes], list[str]]:
    with zipfile.ZipFile(docx_path, "r") as docx:
        names = [info.filename for info in docx.infolist()]
        return {name: docx.read(name) for name in names}, names


def update_document(entries: dict[str, bytes]) -> None:
    document = ET.fromstring(entries["word/document.xml"])
    rels = ET.fromstring(entries["word/_rels/document.xml.rels"])
    rel_targets = {rel.get("Id"): rel.get("Target") for rel in rels.findall("rel:Relationship", NS)}

    for paragraph in document.findall(".//w:p", NS):
        if paragraph_text(paragraph).startswith("学生角色完成选课全流程"):
            replace_paragraph_text(paragraph, TEACHER_DESCRIPTION)

        blips = paragraph.findall(".//a:blip", NS)
        if not blips:
            continue
        target = rel_targets.get(blips[0].get(qn(R, "embed")))
        extent = paragraph.find(".//wp:extent", NS)
        if target == "media/image6.png" and extent is not None:
            extent.set("cx", "5040000")
            extent.set("cy", "2835000")
        elif target == "media/image8.png" and extent is not None:
            extent.set("cx", "4320000")
            extent.set("cy", "6480000")

    entries["word/document.xml"] = ET.tostring(document, encoding="utf-8", xml_declaration=True)


def update_styles(entries: dict[str, bytes]) -> None:
    styles = ET.fromstring(entries["word/styles.xml"])
    for style_id in ["ThesisHeading1", "ThesisHeading2", "ThesisHeading3", "ThesisCaption"]:
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


def update_diagram_relationships(entries: dict[str, bytes]) -> None:
    rels = ET.fromstring(entries["word/_rels/document.xml.rels"])
    for rel in rels.findall("rel:Relationship", NS):
        if rel.get("Target") == "media/image6.png":
            rel.set("Target", "media/image6.svg")
        elif rel.get("Target") == "media/image8.png":
            rel.set("Target", "media/image8.svg")
    entries["word/_rels/document.xml.rels"] = ET.tostring(rels, encoding="utf-8", xml_declaration=True)


def update_content_types(entries: dict[str, bytes]) -> None:
    content_types = ET.fromstring(entries["[Content_Types].xml"])
    has_svg = any(
        element.tag == qn(CT, "Default") and element.get("Extension") == "svg"
        for element in content_types
    )
    if not has_svg:
        svg_default = ET.Element(qn(CT, "Default"))
        svg_default.set("Extension", "svg")
        svg_default.set("ContentType", "image/svg+xml")
        content_types.insert(0, svg_default)
    entries["[Content_Types].xml"] = ET.tostring(content_types, encoding="utf-8", xml_declaration=True)


def write_package(entries: dict[str, bytes], original_order: list[str], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(suffix=".docx", dir=str(output_path.parent or Path(".")))
    os.close(fd)
    with zipfile.ZipFile(temp_name, "w", compression=zipfile.ZIP_DEFLATED) as docx:
        written = set()
        for name in original_order:
            docx.writestr(name, entries[name])
            written.add(name)
        for name in sorted(set(entries) - written):
            docx.writestr(name, entries[name])
    shutil.move(temp_name, output_path)


def verify_output(output_path: Path) -> None:
    with zipfile.ZipFile(output_path, "r") as docx:
        bad_member = docx.testzip()
        if bad_member is not None:
            raise RuntimeError(f"Generated DOCX is corrupt at member: {bad_member}")
        comments = ET.fromstring(docx.read("word/comments.xml")).findall(".//w:comment", NS)
        if len(comments) != 6:
            raise RuntimeError(f"Expected 6 retained comments, found {len(comments)}")


def apply_revisions(source_path: Path, output_path: Path) -> None:
    entries, original_order = read_package(source_path)
    update_document(entries)
    update_styles(entries)
    update_settings(entries)
    update_diagram_relationships(entries)
    update_content_types(entries)
    entries["word/media/image6.svg"] = FUNCTION_STRUCTURE_SVG.encode("utf-8")
    entries["word/media/image8.svg"] = DETAILED_FLOW_SVG.encode("utf-8")
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
