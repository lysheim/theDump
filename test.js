const { execSync } = require("node:child_process")
const { writeFileSync } = require("node:fs")

const runGitCommand = (command) => {
	if (!command.startsWith("git ")) {
		throw new Error("Command must be string and only git commands are allowed")
	}

	try {
		const res = execSync(command)
		return res.toString().trim()
	} catch (err) {
		if (err instanceof Error && err.message.includes("Not a git repository")) {
			throw new Error("Directory is not a Git repository")
		}
		throw err
	}
}

const parseGitLogs = (rawLog) => {
	const commitEntries = rawLog.split(commitOutputSeparator).filter((entry) => entry.trim() !== "")

	return commitEntries.map((entry) => {
        if (entry.start)
        console.log(entry)
		const properties = entry.split(commitPropertySeparator)
		if (properties.length < prettyPropertyNamesInOrder.length) {
			throw new Error("Pretty format and property names length mismatch, check prettyFormat and property names array (that they have same number of properties, and in same order)")
		}

		return {
			hash: properties[0],
			authorName: properties[1],
			authorEmail: properties[2],
			subject: properties[3],
			body: properties[4],
			commitDate: properties[5]
		}
	})
}


const commitSeparator = "%x00ENDOFCOMMIT%x00" // Nul-character as separator, as it is not allowed in commit messages
const prettyFormat = `%h%x00%an%x00%ae%x00%s%x00%b%x00%ad${commitSeparator}`

const prettyPropertyNamesInOrder = ["hash", "authorName", "authorEmail", "subject", "body", "commitDate"]
const commitOutputSeparator = "\x00ENDOFCOMMIT\x00\n" // add newline after commit separator to also remove the newlines after each new commit line from git log
const commitPropertySeparator = "\x00"

const getCommitsSinceTag = (tagOrCommitHash) => {
	const log = tagOrCommitHash
		? runGitCommand(`git log --pretty=format:'${prettyFormat}' ${tagOrCommitHash}..HEAD --date=iso-strict`)
		: runGitCommand(`git log --pretty=format:'${prettyFormat}' --date=iso-strict`)
	if (!log) {
		return []
	}
	return parseGitLogs(log)
}

writeFileSync("./res.json", JSON.stringify(getCommitsSinceTag("978a571")))



