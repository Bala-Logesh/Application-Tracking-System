# Troubleshooting Guide
Welcome to the troubleshooting guide for Career Pulse Tracker. If you encounter any issues while setting up or running the project, this document should help you diagnose and resolve common problems.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Common Issues](#common-issues)
- [Getting Further Help](#getting-further-help)

## Prerequisites
Before troubleshooting, ensure:
- You've followed installation/setup instructions in README.md.
- Node.js and npm are installed for React.
- MongoDB is running and accessible.
- Flask environment is set up with necessary dependencies.

## Common Issues

### Issue 1: App doesn't start or throws errors during npm start
#### Possible Causes:
- Missing node_modules after cloning the repository.
- Incorrect environment variables.

#### Solution:
- Run npm install to install dependencies.
- Ensure environment variables are correctly set.

### Issue 2: Database connection error
#### Possible Causes:
- MongoDB server isn't running.
- Connection string is incorrect.

#### Solution:
- Start MongoDB with mongod.
- Verify connection string in the configuration

### Issue 3: Flask server doesn't start
#### Possible Causes:
- Missing dependencies.
- Port already in use.

#### Solution:
- Run `pip install -r requirements.txt` or `pip3 install -r requirements.txt` to ensure all packages are installed.
- Try a different port or ensure no other processes are using the default port.

### Issue 4: API endpoints returning errors
#### Possible Causes:
- Endpoints or routes are incorrectly defined.
- Backend can't connect to MongoDB.

#### Solution:
- Verify route definitions and ensure methods (GET, POST, etc.) are correct.
- Check the backend's MongoDB connection and settings.

## Getting Further Help
- If you're still facing issues:
- Check if the problem has been reported in the Issues section.
- If not listed, create a new issue with as much detail as possible.
- For further help, contact us through the email id