require('dotenv').config();

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

if (privateKey) {
  console.log('Deployer private key loaded successfully.');
} else {
  console.log('Error: Could not load DEPLOYER_PRIVATE_KEY from .env file.');
}
