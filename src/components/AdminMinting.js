import React, { useState, useEffect } from 'react'
import { Grid, Snackbar, IconButton, Alert, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ethers } from 'ethers'
import { getProductContract, getGeneratorContract } from "../utils"
import NFTMintCard from './NFTMintCard'
import NFTOwnerCard from './NFTOwnerCard'
import NFTProductsCard from './NFTProductsCard'

const AdminMinting = ({
  wallet,
  contract,
  loading,
  setLoading,
  userAddress,
  setSelectGeneratorAddress,
  setSelectedProduct,
  setSelectProductPrice,
  setOwnedNFTs
}) => {

  // General
  const [alerts, setAlerts] = useState([false])
  const [useAutoName, setUseAutoName] = useState(true)
  const [size, setSize] = useState([100, 100])

  // Regarding Factory Contract
  const [ETHUSDConversionRate, setETHUSDConversionRate] = useState(undefined)
  const [nftPrice, setNFTPrice] = useState(undefined)
  const [nftNameInput, setNftNameInput] = useState("")

  // Regarding Generator Contract
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [generatorAddress, setGeneratorAddress] = useState(undefined)
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState(undefined)
  const [prodCurrentPrice, setProdCurrentPrice] = useState(undefined)
  const [nftList, setNftList] = useState([])
  const [nftId, setNftId] = useState(undefined)
  const [productNewPrice, setProductNewPrice] = useState(undefined)
  const [newNFTName, setNewNFTName] = useState(undefined)

  // Regarding Product Contract
  const [productAddress, setProductAddress] = useState(undefined)
  const [newProductName, setNewProductName] = useState(undefined)
  const [newProductPrice, setNewProducPrice] = useState(undefined)
  const [sumProductBalances, setSumProductBalances] = useState(0)
  const [selectedAll, setSelectedAll] = useState(false)

  const handleAlerts = (msg, severity) => {
    setAlerts([true, msg, severity])
  }

  const handleCloseAlerts = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlerts([false])
  };

  // NFT Mint Card
  const mintNFT = async () => {
    if (!loading) {
      setLoading(true)
      let nftName
      if (useAutoName) {
        const inital = Math.floor(Math.random() * userAddress.length)
        const final = Math.floor(Math.random() * userAddress.length)
        nftName = "Candy Lamps " + userAddress.substr(0, 6) + userAddress.substr(inital, final)
      } else {
        nftName = nftNameInput
      }

      await getETHUSDConversionRate()
      try {
        let tx = await contract.mintGenerator(
          nftName, { "value": ethers.utils.parseEther(`${nftPrice / ETHUSDConversionRate}`) }
        )
        await tx.wait(1)
        handleAlerts("NFT minted!", "success")
      } catch (error) {
        if (error.code === 4001) {
          handleAlerts("Transaction cancelled", "warning")
        } else if (error.code === "INSUFFICIENT_FUNDS") {
          handleAlerts("Insufficient funds for gas * price + value", "warning")
        } else if (error.code === -32602 || error.code === -32603) {
          handleAlerts("Internal error", "error")
        } else {
          handleAlerts("An unknown error occurred", "error")
        }
      }
    } else if (loading) {
      handleAlerts("Loading... Cannot execute while loading", "warning")
    }

    setLoading(false)
  }

  const getNFTPrice = async () => {
    try {
      await getETHUSDConversionRate()
      const nft_price_BN = await contract.currentNFTPriceInUSD()
      const nft_price = ethers.utils.formatEther(nft_price_BN)
      setNFTPrice(parseFloat(nft_price).toFixed(2))
    } catch (error) {
      setNFTPrice(undefined)
    }
  }

  const handleNFTName = (evt) => {
    setNftNameInput(evt.target.value)
  }

  // NFT Owner Card
  const checkIfTokenOwner = async () => {
    const isOwner = await contract.checkIfTokenHolder(userAddress)
    let tokensOwned
    if (isOwner) {
      tokensOwned = await contract.addressToTokenID(userAddress)
      let new_tokensOwned_arr = []
      for (let ii = 0; ii < tokensOwned.length; ii++) {
        if (tokensOwned[ii] === true) {
          const generator_address = await contract.tokenIDToGenerator(ii)

          const gen_contract = getGeneratorContract(generator_address, wallet.signer)
          const gen_name = await gen_contract.generatorName()

          new_tokensOwned_arr.push({ id: ii, address: generator_address, name: gen_name })
        }
      }
      setNftList(new_tokensOwned_arr)

      //passing owned NFT state to top level App.js
      setOwnedNFTs(new_tokensOwned_arr)

      if (new_tokensOwned_arr.length === 1) {
        setNftId(new_tokensOwned_arr[0].id)
        setGeneratorAddress(new_tokensOwned_arr[0].address)

        const gen_contract = getGeneratorContract(new_tokensOwned_arr[0].address, wallet.signer)
        setGeneratorContract(gen_contract)
      }
    }
  }

  const getNFTInfo = async (event = undefined) => {
    let nft_id
    if (typeof event === "undefined") {
      nft_id = nftId
    } else {
      nft_id = event.target.value
    }
    setNftId(nft_id)

    if (typeof nft_id !== "undefined") {
      for (let ii = 0; ii < nftList.length; ii++) {
        if (nftList[ii].id === nft_id) {
          const nft_address = nftList[ii].address
          setGeneratorAddress(nft_address)

          const gen_contract = getGeneratorContract(nft_address, wallet.signer)
          setGeneratorContract(gen_contract)
          break
        }
      }
    }
  }

  const handleNewName = (evt) => {
    setNewNFTName(evt.target.value)
  }

  const withdrawBalance = async () => {
    try {
      if (!loading) {
        setLoading(true)

        if (selectedAll && sumProductBalances > 0) {
          const tx = await generatorContract.withdraw()
          const rc = await tx.wait(1)
          const event = rc.events.find(event => event.event === 'Withdraw');
          const [time, amount, owner] = event.args;
          console.log(parseFloat(ethers.utils.formatEther(amount)));

          handleAlerts("Withdrawed successfully", "success")
        } else if (selectedAll && sumProductBalances <= 0) {
          handleAlerts("Not enough balance", "warning")
        } else if (!selectedAll) {

          let there_is_product_selected = false
          let products_str = ""
          for (let ii = 0; ii < productList.length; ii++) {
            if (productList[ii].selected) {
              there_is_product_selected = true
              const tx = await productList[ii].contract.withdraw()
              await tx.wait(1)

              products_str += productList[ii].id + ", "
            }
          }

          if (there_is_product_selected) {
            handleAlerts("Withdrawed successfully from products (IDs): " + products_str.substr(0, products_str.length - 2), "success")
          } else {
            handleAlerts("No product selected!", "warning")
          }
        }
        await updateProducts()
      } else if (loading) {
        handleAlerts("Loading... Cannot execute while loading", "info")
      }
    } catch (error) {
      if (error.code === 4001) {
        handleAlerts("Transaction cancelled", "warning")
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        handleAlerts("Insufficient funds for gas * price + value", "warning")
      } else if (error.code === -32602 || error.code === -32603) {
        handleAlerts("Internal error", "error")
      } else {
        handleAlerts("An unknown error occurred", "error")
      }
    }
    setLoading(false)
  }

  const renameNFT = async () => {
    try {
      if (!loading) {
        setLoading(true)
        const tx = await generatorContract.changeName(newNFTName)
        await tx.wait(1)

        for (let ii = 0; ii < nftList.length; ii++) {
          if (nftList[ii].id === nftId) {
            nftList[ii].name = newNFTName
            setNftList(nftList)
            break
          }
        }
      }
      handleAlerts("NFT renamed successfully", "success")
    } catch (error) {
      if (error.code === 4001) {
        handleAlerts("Transaction cancelled", "warning")
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        handleAlerts("Insufficient funds for gas * price + value", "warning")
      } else if (error.code === -32602 || error.code === -32603) {
        handleAlerts("Internal error", "error")
      } else {
        handleAlerts("An unknown error occurred", "error")
      }
    }
    setLoading(false)
    setNewNFTName(undefined)
  }

  // NFT Products Card
  const updateProducts = async () => {
    if (generatorContract) {
      const products_num = await generatorContract.productCount()
      let listOfProducts = []
      let total_balance = 0
      for (let ii = 0; ii < products_num; ii++) {
        const product = await generatorContract.idToProduct(ii)
        const product_balance_BN = await wallet.provider.getBalance(product.contractAddress)
        const product_balance = parseFloat(ethers.utils.formatEther(product_balance_BN))
        const product_obj = {
          id: parseInt(product.id, 16),
          name: product.name,
          priceUSD: parseFloat(ethers.utils.formatEther(product.priceUSD)).toFixed(2),
          address: product.contractAddress,
          selected: false,
          balance: product_balance,
          contract: getProductContract(product.contractAddress, wallet.signer)
        }
        listOfProducts.push(product_obj)
        total_balance += product_balance
      }

      setProductList(listOfProducts)
      setSumProductBalances(total_balance)

      if (listOfProducts.length === 1) {
        setProductId(listOfProducts[0].id)
        setProductAddress(listOfProducts[0].address)

        if (listOfProducts[0].id !== undefined) {
          setSelectedProduct(listOfProducts[0].id)
        }
      }
    }
  }

  const addNewProduct = async () => {
    if (!loading) {
      try {
        setLoading(true)
        const tx = await generatorContract.addProduct(
          newProductName, ethers.utils.parseEther(newProductPrice)
        )
        await tx.wait(1)
        setNewProducPrice(undefined)
        setNewProductName(undefined)
        handleAlerts("New product added successfully", "success")
      } catch (error) {
        if (error.code === 4001) {
          handleAlerts("Transaction cancelled", "warning")
        } else if (error.code === "INSUFFICIENT_FUNDS") {
          handleAlerts("Insufficient funds for gas * price + value", "warning")
        } else if (error.code === -32602 || error.code === -32603) {
          handleAlerts("Internal error", "error")
        } else {
          handleAlerts("An unknown error occurred", "error")
        }
      }
    } else if (loading) {
      handleAlerts("Loading... Cannot execute while loading", "warning")
    }
    setLoading(false)
  }

  const setNewProductPrice = async () => {
    if (!loading) {
      setLoading(true)
      try {
        const tx = await generatorContract.changeProductPrice(
          productId, ethers.utils.parseEther(productNewPrice)
        )
        await tx.wait(1)
        // const product = await generatorContract.idToProduct(productId)
        const new_product_list = productList
        for (let ii = 0; ii < new_product_list.length; ii++) {
          if (new_product_list[ii].id === productId) {
            new_product_list[ii].priceUSD = productNewPrice
            break
          }
        }
        setProdCurrentPrice(productNewPrice)
        setProductNewPrice(undefined)
        handleAlerts("Product price changed successfully", "success")
      } catch (error) {
        if (error.code === 4001) {
          handleAlerts("Transaction cancelled", "warning")
        } else if (error.code === "INSUFFICIENT_FUNDS") {
          handleAlerts("Insufficient funds for gas * price + value", "warning")
        } else if (error.code === -32602 || error.code === -32603) {
          handleAlerts("Internal error", "error")
        } else {
          handleAlerts("An unknown error occurred", "error")
        }
      }
    } else if (loading) {
      handleAlerts("Loading... Cannot execute while loading", "warning")
    }
    setLoading(false)
  }

  const handleNewProductName = (evt) => {
    setNewProductName(evt)
  }

  const handleNewProductPrice = (evt) => {
    setNewProducPrice(evt.target.value)
  }

  const handleProductChangePrice = (evt) => {
    setProductNewPrice(evt.target.value)
  }

  const handleProductList = (evt) => {
    const prod_id = evt.target.value
    setProductId(prod_id)
    for (let ii = 0; ii < productList.length; ii++) {
      if (productList[ii].id === prod_id) {
        setProductAddress(productList[ii].address)
        break
      }
    }
  }

  // General
  async function getETHUSDConversionRate() {
    if (contract) {
      const conversion_rate = await contract.getETHUSDConversionRate()
      setETHUSDConversionRate(ethers.utils.formatEther(conversion_rate))
    }
  }

  const copyToClipboard = async (evt) => {
    // const text = evt.target.value
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(evt.target.innerText);
    } else {
      return document.execCommand('copy', true, evt.target.innerText);
    }
  }

  const resetAllFields = () => {
    setGeneratorContract(undefined)
    setGeneratorAddress(undefined)
    setProductList([])
    setProductId(undefined)
    setProdCurrentPrice(undefined)
    setNftList([])
    setNftId(undefined)
    setProductNewPrice(undefined)
    setNewNFTName(undefined)
    setSelectedAll(false)
  }

  // useEffects
  useEffect(() => {
    if (generatorAddress !== undefined) {
      setSelectGeneratorAddress(generatorAddress)
    }
  }, [generatorAddress])

  useEffect(() => {
    if (productId !== undefined) {
      setSelectedProduct(productId)
      for (let ii = 0; ii < productList.length; ii++) {
        if (productList[ii].id == productId) {
          setProdCurrentPrice(productList[ii].priceUSD)
          setSelectProductPrice(productList[ii].priceUSD)
          break
        }
      }
      setProductId(productId)
    }
  }, [productId])

  useEffect(() => {
    if (wallet && contract) {
      checkIfTokenOwner()
    }
    if (!wallet) {
      resetAllFields()
    }
    setSelectedAll(false)
    getETHUSDConversionRate()
  }, [wallet, loading])

  useEffect(() => {
    if (wallet && contract) {
      checkIfTokenOwner()
    }
    if (contract) {
      getNFTPrice()
    }
  }, [contract])

  useEffect(() => {
    if (generatorContract) {
      updateProducts()
    }
  }, [generatorContract, loading, prodCurrentPrice])

  useEffect(() => {
    if (alerts[0]) {
      setTimeout(handleCloseAlerts, 3000)
    }
  }, [alerts])

  return (
    <>
      <Grid container sx={{
        alignItems: "center", display: "flex",
        drection: "column", margin: 3, justifyContent: "space-around"
      }} >
        <NFTMintCard
          nftPrice={nftPrice}
          ETHUSDConversionRate={ETHUSDConversionRate}
          useAutoName={useAutoName}
          setUseAutoName={setUseAutoName}
          handleNFTName={handleNFTName}
          wallet={wallet}
          loading={loading}
          mintNFT={mintNFT}
        />
        <NFTOwnerCard
          sumProductBalances={sumProductBalances}
          wallet={wallet}
          nftId={nftId}
          size={size}
          getNFTInfo={getNFTInfo}
          nftList={nftList}
          generatorAddress={generatorAddress}
          copyToClipboard={copyToClipboard}
          ETHUSDConversionRate={ETHUSDConversionRate}
          withdrawBalance={withdrawBalance}
          loading={loading}
          renameNFT={renameNFT}
          handleNewName={handleNewName}
          newNFTName={newNFTName}
          productList={productList}
          setProductList={setProductList}
          selectedAll={selectedAll}
          setSelectedAll={setSelectedAll}
        />
        <NFTProductsCard
          size={size}
          handleProductList={handleProductList}
          productId={productId}
          productList={productList}
          generatorAddress={generatorAddress}
          copyToClipboard={copyToClipboard}
          prodCurrentPrice={prodCurrentPrice}
          ETHUSDConversionRate={ETHUSDConversionRate}
          newProductPrice={newProductPrice}
          addNewProduct={addNewProduct}
          loading={loading}
          productNewPrice={productNewPrice}
          handleNewProductName={handleNewProductName}
          handleProductChangePrice={handleProductChangePrice}
          handleNewProductPrice={handleNewProductPrice}
          productAddress={productAddress}
          setNewProductPrice={setNewProductPrice}
          newProductName={newProductName}
        />
      </Grid>
      <Snackbar
        TransitionComponent={Slide}
        onClick={handleCloseAlerts}
        autoHideDuration={6000}
        open={alerts[0]}
      >
        <Alert
          onClick={handleCloseAlerts}
          elevation={6}
          variant="filled"
          severity={alerts[2]}
          sx={{ width: '100%' }}
        >
          {alerts[1]}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseAlerts}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </>
  );
}

export default AdminMinting