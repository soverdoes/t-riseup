"""Extract an image from a saved figma_execute tool result.

Usage:
  python extract_image.py <tool-result.txt> <out-prefix>

Reads JSON, extracts result.base64 (and result.firstBytes for format detection),
writes the decoded bytes to <out-prefix>.<jpg|png>.
"""
import sys, json, base64, os


def main(in_path: str, out_prefix: str) -> int:
    with open(in_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    data = json.loads(raw)
    result = data.get('result', data)
    b64 = result['base64']
    first = result.get('firstBytes', '')
    if first.startswith('ff d8'):
        ext = '.jpg'
    elif first.startswith('89 50 4e 47'):
        ext = '.png'
    else:
        ext = '.bin'
    os.makedirs(os.path.dirname(out_prefix) or '.', exist_ok=True)
    out_path = out_prefix + ext
    bytes_data = base64.b64decode(b64)
    with open(out_path, 'wb') as f:
        f.write(bytes_data)
    print(f'saved {out_path} ({len(bytes_data)} bytes, first={first[:11]})')
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('usage: extract_image.py <tool-result.txt> <out-prefix>', file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2]))
