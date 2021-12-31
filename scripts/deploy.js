
const deploy = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account: ", deployer.address);

  const Poem = await ethers.getContractFactory("PoemContract");
  const deployed = await Poem.deploy(1000);

  console.log('Poem is deployed at: ', deployed.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })