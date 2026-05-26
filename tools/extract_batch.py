"""Extract multiple images from a saved figma_execute batch tool result.

Usage:
  python extract_batch.py <tool-result.txt> <out-dir>

Reads JSON, iterates result.images[], decodes base64 to bytes,
writes each as <name>.<jpg|png> based on firstBytes magic.
"""
import sys, json, base64, os


def main(in_path: str, out_dir: str) -> int:
    with open(in_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    data = json.loads(raw)
    result = data.get('result', data)
    images = result.get('images', [])

    os.makedirs(out_dir, exist_ok=True)
    saved = 0
    for img in images:
        if 'error' in img:
            print(f"SKIP {img.get('name','?')} — {img['error']}")
            continue
        first = img.get('firstBytes', '')
        if first.startswith('ff d8'):
            ext = '.jpg'
        elif first.startswith('89 50 4e 47'):
            ext = '.png'
        else:
            ext = '.bin'
        out_path = os.path.join(out_dir, img['name'] + ext)
        bytes_data = base64.b64decode(img['base64'])
        with open(out_path, 'wb') as f:
            f.write(bytes_data)
        print(f"saved {out_path} ({len(bytes_data)} bytes)")
        saved += 1
    print(f"\nTotal: {saved}/{len(images)}")
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('usage: extract_batch.py <tool-result.txt> <out-dir>', file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2]))
