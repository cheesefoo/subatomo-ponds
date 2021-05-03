from json import dumps
from os import listdir
from os.path import isfile, join, dirname, abspath
from pathlib import PurePath
from subprocess import run

import gspread
from gspread.exceptions import APIError
from oauth2client.service_account import ServiceAccountCredentials
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from tenacity import retry, retry_if_exception_type, wait_random_exponential

# run this from 'src/submissionImportScript'
# Set location of texture packer exe
# client_secrets.json is not committed for security
#TEXTURE_PACKER_EXE = join('K:\\Utilities\\TexturePacker\\bin', 'TexturePacker.exe')
# TEXTURE_PACKER_EXE = join('C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin', 'TexturePacker.exe')
ASSETS_DIR = PurePath(dirname(dirname(abspath(__file__))), 'assets')
JSON_DESTINATION_DIR = join(ASSETS_DIR, 'test_submissions')
RAW_IMAGES_DIR = join(ASSETS_DIR, 'test_all_submissions_raw')
SPLIT_IMAGES_DIR = join(ASSETS_DIR, 'test_all_submissions_split')
SPRITESHEET_DIR = join(ASSETS_DIR, 'test_submissions')

template = 'template.png'