#!/usr/bin/env python
"""
coding=utf-8
Main entry point for ResumeParser
"""
import inspect
import logging
import os
import sys

import pandas
import spacy

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir)

from bin import field_extraction
from bin import lib


def main():
    logging.getLogger().setLevel(logging.INFO)

    observations = extract()

    nlp = spacy.load('en_core_web_sm')

    observations, nlp = transform(observations, nlp)

    load(observations, nlp)


def extract():
    logging.info('Begin extract')
    candidate_file_agg = list()

    for root, subdirs, files in os.walk(lib.get_conf('resume_directory')):
        folder_files = map(lambda x: os.path.join(root, x), files)
        candidate_file_agg.extend(folder_files)

    observations = pandas.DataFrame(data=candidate_file_agg, columns=['file_path'])
    logging.info('Found {} candidate files'.format(len(observations.index)))

    observations['extension'] = observations['file_path'].apply(lambda x: os.path.splitext(x)[1])
    observations = observations[observations['extension'].isin(lib.AVAILABLE_EXTENSIONS)]
    logging.info('Subset candidate files to extensions w/ available parsers. {} files remain'.format(len(observations.index)))

    observations['text'] = observations['file_path'].apply(lib.convert_pdf)

    lib.archive_dataset_schemas('extract', locals(), globals())
    logging.info('End extract')
    return observations


def transform(observations, nlp):
    logging.info('Begin transform')

    # Extract candidate name
    observations['candidate_name'] = observations['text'].apply(
        lambda x: field_extraction.candidate_name_extractor(x, nlp)
    )

    # Extract contact fields
    observations['email'] = observations['text'].apply(field_extraction.extract_email)
    observations['phone'] = observations['text'].apply(field_extraction.extract_phone)

    # Extract skills and other fields
    observations = field_extraction.extract_fields(observations)

    lib.archive_dataset_schemas('transform', locals(), globals())
    logging.info('End transform')
    return observations, nlp


def load(observations, nlp):
    logging.info('Begin load')
    output_path = os.path.join(lib.get_conf('summary_output_directory'), 'resume_summary.csv')

    # Format sets as clean comma-separated strings or 'Not detected'
    export_df = observations.copy()
    for col in export_df.columns:
        if col in ['experience', 'platforms', 'database', 'programming', 'machinelearning', 'universities', 'languages', 'hobbies', 'open-source']:
            export_df[col] = export_df[col].apply(
                lambda x: ', '.join(sorted(x)) if isinstance(x, (set, list)) and len(x) > 0 else 'Not detected'
            )

    logging.info('Results being output to {}'.format(output_path))
    print('Results output to {}'.format(output_path))

    export_df.to_csv(path_or_buf=output_path, index_label='index', encoding='utf-8-sig')
    logging.info('End load')


if __name__ == '__main__':
    main()
