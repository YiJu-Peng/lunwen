#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""将带批注 docx 中的批注迁移到新生成的论文 docx。"""
from __future__ import annotations

import re
import shutil
import zipfile
from io import BytesIO
from pathlib import Path
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
CT_NS = 'http://schemas.openxmlformats.org/package/2006/content-types'

SOURCE = Path('/home/pengyiju/下载/2425_41_10475_080902_6020222035_LW (2).docx')
TARGET = Path(__file__).resolve().parent / '2425_41_10475_080902_6020222035_LW.docx'

COMMENT_PARTS = [
    'word/comments.xml',
    'word/commentsExtended.xml',
    'word/commentsIds.xml',
    'word/commentsExtensible.xml',
]

COMMENT_RELS = [
    ('comments', 'comments.xml',
     'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments'),
    ('commentsExtended', 'commentsExtended.xml',
     'http://schemas.microsoft.com/office/2011/relationships/commentsExtended'),
    ('commentsIds', 'commentsIds.xml',
     'http://schemas.microsoft.com/office/2016/09/relationships/commentsIds'),
    ('commentsExtensible', 'commentsExtensible.xml',
     'http://schemas.microsoft.com/office/2018/08/relationships/commentsExtensible'),
]

COMMENT_OVERRIDES = [
    ('/word/comments.xml',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml'),
    ('/word/commentsExtended.xml',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml'),
    ('/word/commentsIds.xml',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsIds+xml'),
    ('/word/commentsExtensible.xml',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtensible+xml'),
]

# comment_id -> paragraph matcher
ANCHORS = [
    ('0', lambda t: t.strip() == '2 相关技术介绍'),
    ('1', lambda t: '2.1.1' in t and 'Spring Boot' in t and '微服务架构' in t),
    ('2', lambda t: t.strip() == '3 系统分析'),
    ('3', lambda t: '（1）用户表（user）' in t or '用户表（user）' in t),
    ('4', lambda t: t.startswith('系统测试用于验证系统功能完整性')),
    ('5', lambda t: t.strip() == '参考文献'),
]


def para_text(p: ET.Element) -> str:
    return ''.join(node.text or '' for node in p.iter(f'{W}t'))


def inject_comment_paragraph(p: ET.Element, cid: str) -> None:
    for tag in (f'{W}commentRangeStart', f'{W}commentRangeEnd'):
        for el in list(p.findall(f'.//{tag}')):
            parent = next((parent for parent in p.iter() if el in list(parent)), None)
            if parent is not None:
                parent.remove(el)
    for r in list(p.findall(f'{W}r')):
        for cref in list(r.findall(f'{W}commentReference')):
            r.remove(cref)
        if not list(r) and not (r.text and r.text.strip()):
            if r.find(f'{W}commentReference') is None and not list(r.findall(f'{W}t')):
                pass

    children = list(p)
    run_indices = [idx for idx, ch in enumerate(children) if ch.tag == f'{W}r']
    if not run_indices:
        return

    start = ET.Element(f'{W}commentRangeStart')
    start.set(f'{W}id', cid)
    p.insert(run_indices[0], start)

    children = list(p)
    run_indices = [idx for idx, ch in enumerate(children) if ch.tag == f'{W}r']
    last_idx = run_indices[-1]

    end = ET.Element(f'{W}commentRangeEnd')
    end.set(f'{W}id', cid)
    p.insert(last_idx + 1, end)

    ref_run = ET.Element(f'{W}r')
    ref = ET.SubElement(ref_run, f'{W}commentReference')
    ref.set(f'{W}id', cid)
    p.insert(last_idx + 2, ref_run)


def next_rid(rels_root: ET.Element) -> str:
    ids = []
    for rel in rels_root.findall(f'{{{REL_NS}}}Relationship'):
        rid = rel.get('Id', '')
        m = re.fullmatch(r'rId(\d+)', rid)
        if m:
            ids.append(int(m.group(1)))
    return f'rId{max(ids) + 1}'


def ensure_comment_package(target_bytes: dict[str, bytes], source_zip: zipfile.ZipFile) -> None:
    for part in COMMENT_PARTS:
        target_bytes[part] = source_zip.read(part)

    ct = ET.fromstring(target_bytes['[Content_Types].xml'])
    existing = {el.get('PartName') for el in ct.findall(f'{{{CT_NS}}}Override')}
    for part_name, content_type in COMMENT_OVERRIDES:
        if part_name in existing:
            continue
        override = ET.SubElement(ct, f'{{{CT_NS}}}Override')
        override.set('PartName', part_name)
        override.set('ContentType', content_type)
    target_bytes['[Content_Types].xml'] = ET.tostring(ct, encoding='utf-8', xml_declaration=True)

    rels_path = 'word/_rels/document.xml.rels'
    rels_root = ET.fromstring(target_bytes[rels_path])
    existing_targets = {rel.get('Target') for rel in rels_root.findall(f'{{{REL_NS}}}Relationship')}
    for _, target_file, rel_type in COMMENT_RELS:
        if target_file in existing_targets:
            continue
        rel = ET.SubElement(rels_root, f'{{{REL_NS}}}Relationship')
        rel.set('Id', next_rid(rels_root))
        rel.set('Type', rel_type)
        rel.set('Target', target_file)
    target_bytes[rels_path] = ET.tostring(rels_root, encoding='utf-8', xml_declaration=True)


def anchor_comments(document_xml: bytes) -> bytes:
    root = ET.fromstring(document_xml)
    body = root.find(f'{W}body')
    if body is None:
        raise RuntimeError('document body not found')

    matched = {cid: False for cid, _ in ANCHORS}
    for p in body.iter(f'{W}p'):
        text = para_text(p)
        if not text.strip():
            continue
        for cid, matcher in ANCHORS:
            if matched[cid]:
                continue
            if matcher(text):
                inject_comment_paragraph(p, cid)
                matched[cid] = True

    missing = [cid for cid, ok in matched.items() if not ok]
    if missing:
        raise RuntimeError(f'未在目标文档中定位到批注锚点: {missing}')

    return ET.tostring(root, encoding='utf-8', xml_declaration=True)


def transfer_comments(source: Path, target: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(source)
    if not target.exists():
        raise FileNotFoundError(target)

    backup = target.with_suffix('.docx.bak')
    shutil.copy2(target, backup)

    with zipfile.ZipFile(source, 'r') as src_zip, zipfile.ZipFile(target, 'r') as tgt_zip:
        target_bytes = {name: tgt_zip.read(name) for name in tgt_zip.namelist()}

        ensure_comment_package(target_bytes, src_zip)
        target_bytes['word/document.xml'] = anchor_comments(target_bytes['word/document.xml'])

    out = BytesIO()
    with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for name, data in target_bytes.items():
            zout.writestr(name, data)
    target.write_bytes(out.getvalue())
    print(f'批注已写入: {target}')
    print(f'备份文件: {backup}')


if __name__ == '__main__':
    transfer_comments(SOURCE, TARGET)
