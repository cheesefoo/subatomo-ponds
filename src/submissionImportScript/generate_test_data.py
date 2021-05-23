import json
import random
from json import dumps
from os import listdir
from os.path import join, dirname, abspath, isfile
from pathlib import PurePath
from subprocess import run

from wand.color import Color
from wand.drawing import Drawing
from wand.image import Image

# run this from 'src/submissionImportScript'
# Set location of texture packer exe
# client_secrets.json is not committed for security
# TEXTURE_PACKER_EXE = join('K:\\Utilities\\TexturePacker\\bin', 'TexturePacker.exe')
TEXTURE_PACKER_EXE = join('C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin', 'TexturePacker.exe')
ASSETS_DIR = PurePath(dirname(dirname(abspath(__file__))), 'assets')
JSON_DESTINATION_DIR = join(ASSETS_DIR, 'test_submissions')
RAW_IMAGES_DIR = join(ASSETS_DIR, 'test_all_submissions_raw')
SPLIT_IMAGES_DIR = join(ASSETS_DIR, 'test_all_submissions_split')
SPRITESHEET_DIR = join(ASSETS_DIR, 'test_submissions')

num_to_make = 500
template = 'template.png'


def random_color():
    color = "%06x" % random.randint(0, 0xFFFFFF)
    hex_number = '#' + color
    return Color(hex_number)


class DuckMaker:
    def __init__(self, num, template_path):
        self.num = num

        self.template = template_path

    def make_images(self):
        for i in range(0, self.num):
            with Drawing() as draw:
                draw.font = 'NotoSansJP-Bold.otf'
                draw.font_size = 40
                draw.font_style
                draw.font_weight = 8
                x1 = 100
                x2 = 300
                y1 = 200 - 25
                y2 = 400 - 25
                # x1 = math.floor(image.width / 4)
                # y2 = math.floor(image.height / 2)
                # y1 = math.floor(image.height / 2 + y2)
                # x2 = math.floor(3 * image.width / 4)

                with Image(filename=self.template) as image:
                    draw.fill_color = random_color()
                    n = str(i)
                    draw.text(x1, y1, n)
                    draw.text(x2, y1, n)
                    draw.text(x1, y2, n)
                    draw.text(x2, y2, n)
                    draw(image)
                    image.save(filename=join(RAW_IMAGES_DIR, '{0}.png'.format(n)))
                    image.clear()

    def make_json(self, ducks_per_pond):
        entries = []
        pond = 0
        for i in range(0, self.num):
            if i % ducks_per_pond == 0:
                pond = pond + 1
            entry = {"name": str(i),
                     "image": str(i),
                     "pond": str(pond),
                     "message": get_random_unicode(128),
                     "sound": random.randint(0, 8)}
            entries.append(entry)

        submissions = {"submissions": entries}
        output = dumps(submissions)
        with open(join(JSON_DESTINATION_DIR, 'submissions.json'), 'w') as f:
            f.write(output)
        print('json written to {}'.format(JSON_DESTINATION_DIR))


def get_random_unicode(length):
    try:
        get_char = unichr
    except NameError:
        get_char = chr

    # Update this to include code point ranges to be sampled
    include_ranges = [
        (0x0021, 0x0021),
        (0x0023, 0x0026),
        (0x0028, 0x007E),
        (0x00A1, 0x00AC),
        (0x00AE, 0x00FF),
        (0x0100, 0x017F),
        (0x0180, 0x024F),
        (0x2C60, 0x2C7F),
        (0x16A0, 0x16F0),
        (0x0370, 0x0377),
        (0x037A, 0x037E),
        (0x0384, 0x038A),
        (0x038C, 0x038C),
    ]

    alphabet = [
        get_char(code_point) for current_range in include_ranges
        for code_point in range(current_range[0], current_range[1] + 1)
    ]
    return ''.join(random.choice(alphabet) for i in range(length))


def split_images():
    files = [f for f in listdir(RAW_IMAGES_DIR) if isfile(join(RAW_IMAGES_DIR, f))]
    for filename in files:
        if not filename.endswith('png'):
            continue
        args = ['convert', join(RAW_IMAGES_DIR, filename), '-crop', '2x2@', '+repage',
                join(SPLIT_IMAGES_DIR, filename[:-4]) + '-%d.png']
        run(args, shell=True, check=True)


def pack_spritesheet_free():
    # free-tex-packer-cli --project /path/to/project.ftpp --output /path/to/output/folder
    project = 'project.ftpp'
    args = ['free-tex-packer-cli', '--project', project, '--output', SPRITESHEET_DIR]
    run(args, shell=True, check=True)
    merge_json()


def pack_spritesheet():
    json_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet.json')
    sheet_filename = join(SPRITESHEET_DIR, 'all_ducks_sheet_{n}.png')
    args = [
        TEXTURE_PACKER_EXE, '--format', "phaser", '--png-opt-level', '1', '--multipack', '--data', json_filename,
        '--sheet',
        sheet_filename, '--max-width', '2048', '--max-height', '2048', SPLIT_IMAGES_DIR]
    run(args, shell=True, check=True)


def merge_json():
    single = '{"textures": [], "meta": {"app": "http://github.com/odrick/free-tex-packer-cli", "version": "0.3.0"}}'
    s = json.loads(single)
    t = s["textures"]
    for file in listdir(SPRITESHEET_DIR):
        if file.startswith("all_ducks_sheet") and file.endswith("json"):
            with open(join(SPRITESHEET_DIR, file)) as f:
                j = json.load(f)
                t += j["textures"]
    output = dumps(s)
    with open(join(JSON_DESTINATION_DIR, "all_ducks_sheet.json"), 'w') as f:
        f.write(output)


def main():
    maker = DuckMaker(500, template)
    maker.make_images()
    maker.make_json(20)
    split_images()
    ##pack_spritesheet_free()
    pack_spritesheet()


if __name__ == '__main__':
    main()
