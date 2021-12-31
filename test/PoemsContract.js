const { expect } = require("chai");

describe('Poems Contract', () => {

    const setup = async ({ maxSupply = 10000}) => {
        const [owner] = await ethers.getSigners();
        const Poem = await ethers.getContractFactory("PoemContract");
        const deployed = await Poem.deploy(maxSupply);

        return {
            owner, deployed,
        };
    }

    describe('Deployment', () => {
        it('Sets mas supply to passed param', async () => {
            const maxSupply = 4000;

            const { deployed } = await setup({ maxSupply });
            const returnMaxSupply = await deployed.maxSupply();
            expect(maxSupply).to.equal(returnMaxSupply)
        })
    })


    describe('Minting', () => {
        it('Mints a new token and assigns it to owner', async () => {
            const { owner, deployed } = await setup({});

            await deployed.mint();

            const ownerOfMinted = await deployed.ownerOf(0);
            expect(ownerOfMinted).to.equal(owner.address);

        })

        it('Has a miting limit', async () => {
            const maxSupply = 2;

            const { deployed } = await setup({ maxSupply });

            // Mint all

            await deployed.mint();
            await deployed.mint();

            // Assert the last minting

            await expect(deployed.mint()).to.be.revertedWith("There are not more available")

        })
    })

    describe('tokenURI', () => {
      it('returns valid metadata', async() => {
          const { deployed } = await setup({});

          await deployed.mint();

          const tokenURI = await deployed.tokenURI(0);
          const stringifieldTokenURI = await tokenURI.toString();

          const [, base64JSON] = stringifieldTokenURI.split(
            'data:application/json;base64'
          );

          const stringifieldMetadata = await Buffer.from(base64JSON, 'base64').toString('ascii');

          const metadata = JSON.parse(stringifieldMetadata);

          expect(metadata).to.have.all.keys("name", "description", "image")
      })
    })
})