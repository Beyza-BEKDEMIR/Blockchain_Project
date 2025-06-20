import Election from '../contract/Election.json';
import contractAddressFile from '../contract/VotingAddress.json';

export const contractAddress = contractAddressFile.address;
export const contractABI = Election.abi;
