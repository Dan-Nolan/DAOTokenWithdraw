const { assert } = require("chai");

const withdrawer = "0x8d408ce0741f3ce0d63a7f5f0e41442227cb9299";
const theDAO = "0xbb9bc244d798123fde783fcc1c72d3bb8c189413";
const withdrawDAO = "0xbf4ed7b27f1d666546e30d74d50d173d20bca754";

describe("Dao Hack", function () {
  let theDAOContract, withdrawDAOContract, balance, withdrawerSigner;
  before(async () => {
    theDAOContract = await ethers.getContractAt("IDAOToken", theDAO);
    withdrawDAOContract = await ethers.getContractAt("IWithdrawDAO", withdrawDAO);

    balance = await theDAOContract.balanceOf(withdrawer);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [withdrawer],
    });

    withdrawerSigner = await ethers.provider.getSigner(withdrawer);
  });

  it("should have some DAO tokens", async function () {
    assert(balance.gt(0));
  });

  describe("approving the dao tokens", () => {
    before(async () => {
      const signer0 = await ethers.provider.getSigner(0);
      await signer0.sendTransaction({
        to: withdrawer,
        value: ethers.utils.parseEther("10")
      });
      // default signer (the one that hardhat generates for us)
      await theDAOContract.connect(withdrawerSigner).approve(withdrawDAO, balance);
    });

    it("should allow the WithdrawDAO to spend our tokens", async () => {
      const allowance = await theDAOContract.allowance(withdrawer, withdrawDAO);

      assert(allowance.gt(0));
    });


    describe("refund the ether", () => {
      let receipt, balanceBefore, balanceAfter;
      before(async () => {
        balanceBefore = await ethers.provider.getBalance(withdrawer);
        const tx = await withdrawDAOContract.connect(withdrawerSigner).withdraw(); // refund the ether
        receipt = await tx.wait();
        balanceAfter = await ethers.provider.getBalance(withdrawer);
      });

      it("should refund us the ether", () => {
        console.log({
          balanceBefore: ethers.utils.formatEther(balanceBefore),
          balanceAfter: ethers.utils.formatEther(balanceAfter)
        });
      });
    });
  });
});
