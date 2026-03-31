#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""兼容入口：统一转调当前维护中的 gen2_main.py。"""

from pathlib import Path
import runpy


if __name__ == '__main__':
    base_dir = Path(__file__).resolve().parent
    runpy.run_path(str(base_dir / 'gen2_main.py'), run_name='__main__')
