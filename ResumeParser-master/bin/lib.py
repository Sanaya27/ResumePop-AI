"""
coding=utf-8
"""
import logging
import os
import re
import subprocess

import pandas
import yaml

from bin import pdf2text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CONF_PATH = os.path.join(BASE_DIR, 'confs', 'config.yaml')
DEFAULT_OUTPUT_DIR = os.path.join(BASE_DIR, 'data', 'output')
CONFS = None

AVAILABLE_EXTENSIONS = {'.csv', '.doc', '.docx', '.eml', '.epub', '.gif', '.htm', '.html', '.jpeg', '.jpg', '.json',
                        '.log', '.mp3', '.msg', '.odt', '.ogg', '.pdf', '.png', '.pptx', '.ps', '.psv', '.rtf', '.tff',
                        '.tif', '.tiff', '.tsv', '.txt', '.wav', '.xls', '.xlsx'}


def load_confs(confs_path=None):
    global CONFS
    if confs_path is None:
        confs_path = DEFAULT_CONF_PATH

    if CONFS is None:
        try:
            with open(confs_path, 'r', encoding='utf-8') as f:
                CONFS = yaml.safe_load(f)
        except (IOError, yaml.YAMLError):
            confs_template_path = confs_path + '.template'
            logging.warning(
                'Confs path: {} does not exist. Attempting to load confs template, '
                'from path: {}'.format(confs_path, confs_template_path))
            with open(confs_template_path, 'r', encoding='utf-8') as f:
                CONFS = yaml.safe_load(f)
    return CONFS


def get_conf(conf_name):
    confs = load_confs()
    val = confs[conf_name]
    if isinstance(val, str) and val.startswith('..'):
        return os.path.abspath(os.path.join(BASE_DIR, 'bin', val))
    return val


def archive_dataset_schemas(step_name, local_dict, global_dict):
    logging.info('Archiving data set schema(s) for step name: {}'.format(step_name))

    data_schema_dir = get_conf('data_schema_dir')
    os.makedirs(data_schema_dir, exist_ok=True)
    schema_output_path = os.path.join(data_schema_dir, step_name + '.csv')
    schema_agg = list()

    env_variables = dict()
    env_variables.update(local_dict)
    env_variables.update(global_dict)

    data_sets = filter(lambda x: type(x[1]) == pandas.DataFrame, env_variables.items())
    data_sets = dict(data_sets)

    for (data_set_name, data_set) in data_sets.items():
        logging.info('Working data_set: {}'.format(data_set_name))
        local_schema_df = pandas.DataFrame(data_set.dtypes, columns=['type'])
        local_schema_df['data_set'] = data_set_name
        schema_agg.append(local_schema_df)

    if schema_agg:
        agg_schema_df = pandas.concat(schema_agg)
        agg_schema_df.to_csv(schema_output_path, index_label='variable')


def build_term_regex(term):
    escaped = re.escape(term)
    prefix = r'(?<![a-zA-Z0-9])'

    if term[-1].isalnum():
        if len(term) == 1:
            suffix = r'(?![a-zA-Z0-9+#])'
        else:
            suffix = r'(?![a-zA-Z0-9])'
    elif term.endswith('++') or term.endswith('#'):
        suffix = r'(?![a-zA-Z0-9+#])'
    else:
        suffix = r'(?![a-zA-Z0-9])'

    return prefix + escaped + suffix


def term_count(string_to_search, term):
    if not string_to_search or not term:
        return 0
    try:
        pattern = build_term_regex(term)
        regular_expression = re.compile(pattern, re.IGNORECASE)
        result = regular_expression.findall(string_to_search)
        return len(result)
    except Exception as e:
        logging.error('Error occurred during regex search for term {}: {}'.format(term, e))
        return 0


def term_match(string_to_search, regex_pattern):
    if not string_to_search or not regex_pattern:
        return None
    try:
        regular_expression = re.compile(regex_pattern, re.IGNORECASE)
        match = regular_expression.search(string_to_search)
        if match:
            return match.group(0).strip()
        return None
    except Exception as e:
        logging.error('Error occurred during regex search: {}'.format(e))
        return None


def convert_pdf(f):
    output_filename = os.path.basename(os.path.splitext(f)[0]) + '.txt'
    os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)
    output_filepath = os.path.join(DEFAULT_OUTPUT_DIR, output_filename)
    logging.info('Writing text from {} to {}'.format(f, output_filepath))

    pdf2text.main(args=[f, '--outfile', output_filepath])

    with open(output_filepath, 'r', encoding='utf-8', errors='replace') as file:
        return file.read()
