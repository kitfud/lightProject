import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Grid } from '@mui/material'
import { ethers } from 'ethers'
import { getGeneratorContract } from "../utils"
import NFTMintCard from './NFTMintCard'
import NFTOwnerCard from './NFTOwnerCard'
import NFTProductsCard from './NFTProductsCard'
import { setProductList } from "../features/product"
import { setGeneratorList } from '../features/generator'
import { setPathname } from '../features/pathname'

const AdminMinting = ({
  loading,
  setLoading,
  updateGeneratorList,
  updateProductList,
  sumProductBalances,
  handleAlerts,
  copyToClipboard
}) => {

  // Dispatch
  const dispatch = useDispatch()

  // General
  const userAddress = useSelector((state) => state.userAddress.value)
  const wallet = useSelector((state) => state.wallet.value)
  const { socket } = useSelector((state) => state.webSocket.value)
  const { port } = useSelector(state => state.connection.value)

  const [useAutoName, setUseAutoName] = useState(true)
  const [size, setSize] = useState([100, 100])

  // Regarding Factory Contract
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const wrongNetwork = useSelector((state) => state.network.value.wrongNetwork)

  const [ETHUSDConversionRate, setETHUSDConversionRate] = useState(undefined)
  const [nftPrice, setNFTPrice] = useState(undefined)
  const [nftNameInput, setNftNameInput] = useState("")

  // Regarding Generator Contract
  const generatorList = useSelector((state) => state.generator.value)
  const productList = useSelector((state) => state.product.value)

  const [newNFTName, setNewNFTName] = useState(undefined)
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [generatorAddress, setGeneratorAddress] = useState(undefined)
  const [generatorId, setGeneratorId] = useState(undefined)
  const [productId, setProductId] = useState(undefined)
  const [prodCurrentPrice, setProdCurrentPrice] = useState(undefined)
  const [selectedProduct, setSelectedProduct] = useState(false)

  // Regarding Product Contract
  const [productAddress, setProductAddress] = useState(undefined)
  const [newProductName, setNewProductName] = useState(undefined)
  const [newProductPrice, setNewProducPrice] = useState(undefined)
  const [productNewPrice, setProductNewPrice] = useState(undefined)
  const [selectedAll, setSelectedAll] = useState(false)

  // NFT Mint Card
  const mintNFT = async () => {
    if (!loading && wallet && !wrongNetwork) {
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
        let tx = await factoryContract.mintGenerator(
          nftName, { "value": ethers.utils.parseEther(`${(nftPrice / ETHUSDConversionRate) + 0.000000000001}`) }
        )
        await tx.wait(1)

        await updateGeneratorList()
        await updateProductList()

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
    } else if (!wallet) {
      handleAlerts("Please, first connect your crypto wallet (click on the top right orange button)", "warning")
    } else if (wrongNetwork) {
      handleAlerts("Please, change to the right network (click on the top right red button)", "warning")
    }

    setLoading(false)
  }

  const getNFTPrice = async () => {
    try {
      await getETHUSDConversionRate()
      const nft_price_BN = await factoryContract.currentNFTPriceInUSD()
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
  const getGeneratorInfo = async (event = undefined) => {
    let nft_id
    if (typeof event === "undefined") {
      nft_id = generatorId
    } else {
      nft_id = event.target.value
    }
    setGeneratorId(nft_id)

    if (typeof nft_id !== "undefined") {
      const nft_address = generatorList[nft_id].address
      setGeneratorAddress(nft_address)

      const gen_contract = getGeneratorContract(nft_address, wallet.signer)
      setGeneratorContract(gen_contract)
    }
  }

  const handleNewName = (evt) => {
    setNewNFTName(evt.target.value)
  }

  const withdrawBalance = async () => {
    try {
      if (!loading && generatorId && selectedProduct) {
        setLoading(true)

        let there_is_product_selected = false
        let products_str = ""
        let tx = undefined
        const products = Object.keys(productList[generatorId])
        for (let ii = 0; ii < products.length; ii++) {
          if (productList[generatorId][products[ii]].selected) {
            there_is_product_selected = true
            if (productList[generatorId][products[ii]].balance > 0) {
              tx = await productList[generatorId][products[ii]].contract.withdraw()

              products_str += products[ii] + ", "
            }
          }
        }
        if (tx) {
          await tx.wait(1)
        }

        if (there_is_product_selected) {
          handleAlerts("Withdrawed successfully from products (IDs): " + products_str.substr(0, products_str.length - 2), "success")
        } else {
          handleAlerts("No product selected!", "warning")
        }
        await updateProductList()

      } else if (loading) {
        handleAlerts("Loading... Cannot execute while loading", "info")
      } else if (!selectedProduct) {
        handleAlerts("No product is selected", "warning")
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

  const withdrawAndDelete = async () => {
    try {
      if (!loading && generatorId && selectedProduct) {
        setLoading(true)

        let products_str = ""
        let tx = undefined
        const products = Object.keys(productList[generatorId])
        for (let ii = 0; ii < products.length; ii++) {
          if (productList[generatorId][products[ii]].selected) {
            tx = await productList[generatorId][products[ii]].contract.destroy()

            products_str += products[ii] + ", "
          }
        }

        if (tx) {
          await tx.wait(1)
        }

        await updateProductList()

        handleAlerts("Successfully deleted products (IDs): " + products_str.substr(0, products_str.length - 2), "success")

      } else if (loading) {
        handleAlerts("Loading... Cannot execute while loading", "info")
      } else if (!selectedProduct) {
        handleAlerts("No product is selected", "warning")
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
      if (!loading && newNFTName) {
        setLoading(true)
        const tx = await generatorContract.changeName(newNFTName)
        await tx.wait(1)

        for (let ii = 0; ii < generatorList.length; ii++) {
          if (generatorList[ii].id === generatorId) {
            generatorList[ii].name = newNFTName
            dispatch(setGeneratorList(generatorList))
            break
          }
        }
        handleAlerts("NFT renamed successfully", "success")
      } else if (!newNFTName) {
        handleAlerts("NFT new name must not be blank", "warning")
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
    setNewNFTName(undefined)
  }

  // NFT Products Card
  const addNewProduct = async () => {
    if (!loading && newProductName && newProductPrice >= 0 && newProductPrice) {
      try {
        setLoading(true)
        const tx = await generatorContract.addProduct(
          newProductName, ethers.utils.parseEther(newProductPrice)
        )
        await tx.wait(1)
        setNewProducPrice(undefined)
        setNewProductName(undefined)
        await updateProductList()
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
    } else if (!newProductName) {
      handleAlerts("New product name must not be blank", "warning")
    } else if (newProductPrice < 0 || !newProductPrice) {
      handleAlerts("New product price must be zero or positive", "warning")
    }
    setLoading(false)
  }

  const setNewProductPrice = async () => {
    if (!loading && generatorId && productNewPrice >= 0 && !productNewPrice === "") {
      setLoading(true)
      try {
        const tx = await generatorContract.changeProductPrice(
          productId, ethers.utils.parseEther(productNewPrice)
        )
        await tx.wait(1)
        // const product = await generatorContract.idToProduct(productId)
        await updateProductList()

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
    } else if (productNewPrice < 0 || !productNewPrice) {
      handleAlerts("New price must be zero or positive", "warning")
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

    const prod_address = productList[generatorId][prod_id].address
    setProductAddress(prod_address)

    const prod_current_price = productList[generatorId][prod_id].priceUSD
    setProdCurrentPrice(prod_current_price)
  }

  // General
  async function getETHUSDConversionRate() {
    if (factoryContract) {
      const conversion_rate = await factoryContract.getETHUSDConversionRate()
      setETHUSDConversionRate(ethers.utils.formatEther(conversion_rate))
    }
  }

  const resetAllFields = () => {
    setGeneratorContract(undefined)
    setGeneratorAddress(undefined)
    dispatch(setProductList(undefined))
    setProductId(undefined)
    setProdCurrentPrice(undefined)
    dispatch(setGeneratorList(undefined))
    setGeneratorId(undefined)
    setProductNewPrice(undefined)
    setNewNFTName(undefined)
    setSelectedAll(false)
    setProductAddress(undefined)
  }

  // useEffects
  useEffect(() => {
    dispatch(setPathname(window.location.pathname))
  }, [])

  useEffect(() => {
    if (productId !== undefined && generatorId) {
      setProdCurrentPrice(productList[generatorId][productId].priceUSD)
      setProductId(productId)
    }
  }, [productId])

  useEffect(() => {
    const updtProdList = async () => {
      await updateProductList()
    }
    if (wallet && !loading) {
      if (!generatorId && generatorList) {
        const generatorIds_arr = Object.keys(generatorList)
        if (generatorIds_arr.length === 1) {
          setGeneratorId(generatorIds_arr[0])
          setGeneratorAddress(generatorList[generatorIds_arr[0]].address)
          setGeneratorContract(generatorList[generatorIds_arr[0]].contract)
        }
      }
      if (!productList && generatorList) {
        updtProdList()
      }
    } else if (!generatorList) {
      setGeneratorAddress(undefined)
    }
  }, [wallet, generatorList])

  useEffect(() => {
    if (wallet && !loading) {
      if (!productId && productList && generatorId) {
        const productIds_arr = Object.keys(productList[generatorId])
        if (productIds_arr.length === 1) {
          setProductId(productIds_arr[0])
          setProductAddress(productList[generatorId][productIds_arr[0]].address)
          setProdCurrentPrice(productList[generatorId][productIds_arr[0]].priceUSD)
        }
      }
    }
  }, [wallet, productList, generatorId])

  useEffect(() => {
    if (wallet && factoryContract && !wrongNetwork) {
      updateGeneratorList()
    }
    if (!wallet) {
      resetAllFields()
    }
    setSelectedAll(false)
    getETHUSDConversionRate()
  }, [wallet, loading])

  useEffect(() => {
    if (wallet && factoryContract && !wrongNetwork) {
      updateGeneratorList()
    }
    if (factoryContract) {
      getNFTPrice()
    }
  }, [factoryContract])

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
          handleAlerts={handleAlerts}
        />
        <NFTOwnerCard
          sumProductBalances={sumProductBalances}
          wallet={wallet}
          generatorId={generatorId}
          size={size}
          getGeneratorInfo={getGeneratorInfo}
          generatorList={generatorList}
          generatorAddress={generatorAddress}
          copyToClipboard={copyToClipboard}
          ETHUSDConversionRate={ETHUSDConversionRate}
          withdrawBalance={withdrawBalance}
          loading={loading}
          renameNFT={renameNFT}
          handleNewName={handleNewName}
          newNFTName={newNFTName}
          productList={productList}
          selectedAll={selectedAll}
          setSelectedAll={setSelectedAll}
          withdrawAndDelete={withdrawAndDelete}
          setSelectedProduct={setSelectedProduct}
          handleAlerts={handleAlerts}
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
          generatorId={generatorId}
        />
      </Grid>
    </>
  );
}

export default AdminMinting
