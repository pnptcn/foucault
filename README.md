# Foucault

A browser extension that provides an interface with the Panopticon API, and the Observatory platform.

## Installation

At the moment, Foucault is not available on the Chrome Web Store. To install it, you will need to clone this repository and load it as an unpacked extension in Chrome.

To do this, open Chrome and go to `chrome://extensions`. Click on the "Load unpacked extension..." button and select the `foucault` directory.

## Usage

Foucault is a browser extension that provides an interface with the Panopticon API, and the Observatory platform.

You will need to have the Panopticon API running locally.

## Features

- Automatically extract granular entities and relationships from any page you visit.
- Keeps track of data lineage and context by joining page (meta) data onto the extracted data.
- Scans for common tracking and analytics technologies and collects their IDs, comparing them to
  any previously collected IDs to uncover hidden relationships with other sites.
