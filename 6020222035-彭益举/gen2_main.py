#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""主入口：组合 part1 + part2 + part3 生成完整论文"""
import sys
sys.path.insert(0, '/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/')

import importlib.util, types

def load(path):
    spec = importlib.util.spec_from_file_location('m', path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

# ── 执行 Part1（生成 doc 对象 + 封面/摘要/目录）────────────────
p1 = load('/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/gen2_part1.py')
doc       = p1.doc
body      = p1.body
h1        = p1.h1
h2        = p1.h2
h3        = p1.h3
insert_fig = p1.insert_fig
tbl_add   = p1.tbl_add
code_block = p1.code_block
start_section = p1.start_section
OUT       = p1.OUT

# ── 执行 Part2（第1-3章）────────────────────────────────────────
p2 = load('/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/gen2_part2.py')
p2.write_ch1_3(doc, body, h1, h2, h3, insert_fig, tbl_add, code_block)

# ── 执行 Part2b（第1-3章扩展）────────────────────────────────────
p2b = load('/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/gen2_part2b.py')
p2b.write_ch1_3_expanded(doc, body, h1, h2, h3, insert_fig, tbl_add, code_block)

# ── 执行 Part3（第4-7章 + 参考文献 + 致谢）──────────────────────
p3 = load('/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/gen2_part3.py')
p3.write_ch4_7(doc, body, h1, h2, h3, insert_fig, tbl_add, code_block, start_section)

# ── 执行 Part3b（第4-5章扩展）────────────────────────────────────
p3b = load('/home/pengyiju/code/lunwen/lunwen/6020222035-彭益举/gen2_part3b.py')
p3b.write_ch4_5_expanded(doc, body, h1, h2, h3, insert_fig, tbl_add, code_block)

# ── 保存 ────────────────────────────────────────────────────────
doc.save(OUT)
print(f'Done -> {OUT}')
