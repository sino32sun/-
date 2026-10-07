from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
out = root / 'releases'
out.mkdir(exist_ok=True)
with ZipFile(out / '项目罗盘-离线版.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'dist').rglob('*')):
        if path.is_file():
            archive.write(path, 'app/' + path.relative_to(root / 'dist').as_posix())
    for path in sorted((root / 'offline').iterdir()):
        if path.is_file():
            archive.write(path, path.name)
print('Offline package built.')
