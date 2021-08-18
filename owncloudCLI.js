#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const owncloud = require('@667/js-owncloud-client')
const yargs = require('yargs')
const fs = require('fs')
const ora = require('ora')

if (!process.env.OWNCLOUD_USERNAME) {
    console.error('OWNCLOUD_USERNAME env var is unset')
    process.exit(1)
} else if (!process.env.OWNCLOUD_PASSWORD) {
    console.error('OWNCLOUD_PASSWORD env var is unset')
    process.exit(1)
} else if (!process.env.OWNCLOUD_URL) {
    console.error('OWNCLOUD_URL env var is unset')
    process.exit(1)
}

const OWNCLOUD_USERNAME = process.env.OWNCLOUD_USERNAME
const OWNCLOUD_PASSWORD = process.env.OWNCLOUD_PASSWORD
const OWNCLOUD_URL = process.env.OWNCLOUD_URL

const upload = async (sourceFilename, destFilename) => {
	const oc = new owncloud(OWNCLOUD_URL)
	oc
		.login(OWNCLOUD_USERNAME, OWNCLOUD_PASSWORD)
		.then(async (status) => {
			try {
                const buffer = fs.readFileSync(sourceFilename)
                const spinner = ora(`Uploading ${sourceFilename}`).start();
				uploaded = await oc.files.putFileContents(destFilename, buffer)
                spinner.succeed(`Uploaded ${sourceFilename} to ${destFilename}`, uploaded)
			} catch (error) {
                spinner.fail(`Error uploading ${destFilename}: ${error}`)
				process.exit(1)
			}
		})
		.catch((error) => {
			console.error(`Error connecting to owncloud (${OWNCLOUD_URL}): ${error}`)
			process.exit(1)
		})
}

yargs.scriptName('owncloudCLI')
    .usage('$0 <cmd> [args]')
    .command('upload [sourceFilename] [destFilename]', '', yargs => {
        yargs.positional('sourceFilename', {
            type: 'string',
            describe: 'The filename of the source artifact you want to upload.'
        })
        .positional('destFilename', {
            type: 'string',
            description: 'The absolute filename on the owncloud server where you want to upload your artifact.'
        })
    }, argv => {
        upload(argv.sourceFilename, argv.destFilename)
    })
    .help()
    .argv