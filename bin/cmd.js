#!/usr/bin/env node
'use strict'

const program = require('commander')
const credentials = require('../')()

let stdin = ''

program.version('1.0.0')

program
	.command('hash [password]')
	.description('Hash password')
	.option(
		'-w --work <work>',
		'relative work load (0.5 for half the work)',
		Number
	)
	.option('-k --key-length <key-length>', 'length of salt', Number)
	.action((password, {keyLength, hashMethod, work}) => {
		credentials.configure({keyLength, hashMethod, work})
		credentials.hash(stdin || password).then(console.log, console.error)
	})

program
	.command('verify [hash] <password>')
	.description('Verify password')
	.action((hash, password) =>
		credentials.verify(stdin || hash, password).then(result => {
			console.log(result ? 'Verified' : 'Invalid')
			process.exit(result ? 0 : 1)
		}, console.error)
	)

if (process.stdin.isTTY) {
	program.parse(process.argv)
} else {
	process.stdin.on('readable', () => (stdin += this.read() || ''))
	process.stdin.on('end', () => program.parse(process.argv))
}
