# Parking Project

Short description of the project.

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database](#database)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## About

Long description of the project.

This project is not open source and is intended for private use only. Unauthorized distribution, reproduction, or modification of this software is strictly prohibited.
This is A Node.js server for the Parking Project.
It Serves as a REST API for the Multi-Platform Parking Project.
It is built using the Express.js framework.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
git clone https://github.com/Yishei/parking_project.git
```

Then change directory to the project folder:

```
cd parking_project
```

Then install dependencies:

```
npm install
```

Then start the server:

```

npm start
```

### Database

- MySQL

## Features

- Handles `Webhooks` from the OpenALPR Cloud API
- Handles `Super Admin` requests For the Super Admin Portal
- Handles `Condo Admin` requests For the Condo Admin Portal
- Handles `User` requests For the User Portal
- Handles `Towing` requests For the Towing Portal

### Usage

- `GET /webhook`: Webhook routes
- `GET /superAdmin`: Super admin routes
- `GET /condoAdmin`: Condo admin routes
- `GET /user`: User routes

### Environment Variables

- `PORT`: Port number for the server to listen on
- `DB_HOST`: Database host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

### Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make changes and commit: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### License

This project is licensed under the [LICENSE NAME] License - see the [LICENSE.md](LICENSE.MD) file for details.
