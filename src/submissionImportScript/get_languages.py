from json import dumps
from os.path import join, dirname, abspath
from pathlib import PurePath

import gspread

ASSETS_DIR = PurePath(dirname(dirname(abspath(__file__))), 'assets')
JSON_DESTINATION_DIR = join(ASSETS_DIR, 'localization')
SHEETS_ID = '1aY63bzNi2VbYS9yD3Zu4DbcUz0H9vFj8cL9o199BzEU'
DRIVE_ID = '1x4ErkPqyRwgPn87wGeclYwk1uRY0yy0x'


def download_json():
    # authenticate and get sheet
    gc = gspread.service_account('client_secrets.json')
    sh = gc.open_by_key(SHEETS_ID)
    worksheet = sh.sheet1

    num_of_rows = worksheet.row_count
    num_of_cols = worksheet.col_count
    print(num_of_cols)
    languages = worksheet.row_values(1)

    result = {}
    # for language in languages:
    #     result[language] = {}
    for i in range(1, num_of_cols):
        lines = worksheet.col_values(i)
        print(lines[0])
        result[lines[0]] = {}
        lang = result[lines[0]]
        lines = lines[1:]
        section = []
        for line in lines:
            # print(line)
            if line is None or line == "":
                section.append("~NOT YET TRANSLATED~")
            elif line[0] == "[":
                section = []
                lang[line[1:]] = section
            elif line[0] == "]" or line[0] == "~":
                continue
            elif line[0] == "!END":
                break
            else:
                section.append(line)

    # print(result)

    output = dumps(result)
    with open(join(JSON_DESTINATION_DIR, 'languages.json'), 'w') as f:
        f.write(output)
    print('json written to {}'.format(JSON_DESTINATION_DIR))


def main():
    download_json()


if __name__ == '__main__':
    main()
