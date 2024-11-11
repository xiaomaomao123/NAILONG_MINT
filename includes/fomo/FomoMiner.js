
import suidouble from 'suidouble';
import { bcs } from '@mysten/sui/bcs';
import hasher from 'js-sha3';
import CSwap from '../swap.js'
import BN from 'bn.js';
const { SuiMaster } = suidouble;
import { SuiClient,getFullnodeUrl,SuiHTTPTransport } from '@mysten/sui/client';
// import { spawn, Thread, Worker } from "threads";
import { bytesTou64, bigIntTo32Bytes, u64toBytes } from '../math.js';
import { CetusClmmSDK, Percentage, d, adjustForSlippage } from '@cetusprotocol/cetus-sui-clmm-sdk'
const mairpc = [
            "https://api.zan.top/node/v1/sui/mainnet/14e6ab8aeea3456f806fea549a9459ae",
            "https://api.zan.top/node/v1/sui/mainnet/873545cadacd4e3c8006c34fdc670b07",
            "https://api.zan.top/node/v1/sui/mainnet/4ddeaf550d3b4ebda6b7567799c0b405",
            "https://api.zan.top/node/v1/sui/mainnet/a0dcea28f5064cf083226dd9d5b44101",
            "https://api.zan.top/node/v1/sui/mainnet/12624be660874e41a8e202743eb74ea2",
            "https://api.zan.top/node/v1/sui/mainnet/973ca67cfaf94c82a8689bc658072762",
            "https://api.zan.top/node/v1/sui/mainnet/fd92bb06e88a4ead8471ebe39d55e094",
            "https://api.zan.top/node/v1/sui/mainnet/e84afe7a6698489f88ad5c6d55af2bb7",
            "https://api.zan.top/node/v1/sui/mainnet/3fa4f57b5e484946a3df76d3b48bc7cb",
            "https://api.zan.top/node/v1/sui/mainnet/787537d8541644748a46aa0e981d41c8",
            "https://api.zan.top/node/v1/sui/mainnet/a5529387c2a747429df7e8140c966900",
            "https://api.zan.top/node/v1/sui/mainnet/b65f4d53caea4e3583001ff497059355",
            "https://api.zan.top/node/v1/sui/mainnet/79d7a926f69d4b7096a63935265dfd33",
			];
const randomstr =mairpc[Math.floor(Math.random() * mairpc.length)];
const subrpc = [
            "https://api.zan.top/node/v1/sui/mainnet/14e6ab8aeea3456f806fea549a9459ae",
            "https://api.zan.top/node/v1/sui/mainnet/873545cadacd4e3c8006c34fdc670b07",
            "https://api.zan.top/node/v1/sui/mainnet/4ddeaf550d3b4ebda6b7567799c0b405",
            "https://endpoints.omniatech.io/v1/sui/mainnet/9635a40963814f4ca4a2e3602ca9b57d",
             "https://sui.blockpi.network/v1/rpc/14170c92f897123649461d145c9705fc9bd84532",
            "https://api.infstones.com/sui/mainnet/3c7972f34b794f71b882d3a8d6afd21f",
			"https://rpc-mainnet.suiscan.xyz",
            "https://fullnode.sui.mainnet.aftermath.finance/",
            "https://sui-mainnet.nodeinfra.com",
            "https://mainnet.sui.rpcpool.com",
            "https://fullnode.mainnet.sui.io:443",
            "https://sui-mainnet.public.blastapi.io",
            "https://mainnet.suiet.app",
            "https://sui-rpc.publicnode.com",
            "https://sui-mainnet-ca-2.cosmostation.io",
			"https://sui-mainnet-us-1.cosmostation.io",
            "https://sui-mainnet-us-2.cosmostation.io",
            ];
const mainnet = {
            fullRpcUrl: randomstr,
            swapCountUrl: 'https://api-sui.cetus.zone/v2/sui/swap/count',
            simulationAccount: {
            address: '0x0a687ee23bba223329e9439dab8ad9e95d02c8a85f838118031959ada024135b' // 必须有这个要不估算会报错
            },
            cetus_config: {
            package_id: '0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f',
            published_at: '0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f',
            config: {
                coin_list_id: '0x8cbc11d9e10140db3d230f50b4d30e9b721201c0083615441707ffec1ef77b23',
                launchpad_pools_id: '0x1098fac992eab3a0ab7acf15bb654fc1cf29b5a6142c4ef1058e6c408dd15115',
                clmm_pools_id: '0x15b6a27dd9ae03eb455aba03b39e29aad74abd3757b8e18c0755651b2ae5b71e',
                admin_cap_id: '0x39d78781750e193ce35c45ff32c6c0c3f2941fa3ddaf8595c90c555589ddb113',
                global_config_id: '0x0408fa4e4a4c03cc0de8f23d0c2bbfe8913d178713c9a271ed4080973fe42d8f',
                coin_list_handle: '0x49136005e90e28c4695419ed4194cc240603f1ea8eb84e62275eaff088a71063',
                launchpad_pools_handle: '0x5e194a8efcf653830daf85a85b52e3ae8f65dc39481d54b2382acda25068375c',
                clmm_pools_handle: '0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb'
            }
            },
        clmm_pool: {
            package_id: '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb',
            published_at: '0x70968826ad1b4ba895753f634b0aea68d0672908ca1075a2abdf0fc9e0b2fc6a',
            config: {
                pools_id: '0xf699e7f2276f5c9a75944b37a0c5b5d9ddfd2471bf6242483b03ab2887d198d0',
                global_config_id: '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
                global_vault_id: '0xce7bceef26d3ad1f6d9b6f13a953f053e6ed3ca77907516481ce99ae8e588f2b',
                admin_cap_id: '0x89c1a321291d15ddae5a086c9abc533dff697fde3d89e0ca836c41af73e36a75',
                partners_id: '0xac30897fa61ab442f6bff518c5923faa1123c94b36bd4558910e9c783adfa204'
                }
            },
        integrate: {
            package_id: '0x996c4d9480708fb8b92aa7acf819fb0497b5ec8e65ba06601cae2fb6db3312c3',
            published_at: '0x6f5e582ede61fe5395b50c4a449ec11479a54d7ff8e0158247adfda60d98970b'
        },
        deepbook: {
            package_id: '0x000000000000000000000000000000000000000000000000000000000000dee9',
            published_at: '0x000000000000000000000000000000000000000000000000000000000000dee9'
        },
        deepbook_endpoint_v2: {
            package_id: '0x0dd416959739e1db3a4c6f9cac7f9e7202678f3b067d6d419e569a124fc35e0e',
            published_at: '0x0dd416959739e1db3a4c6f9cac7f9e7202678f3b067d6d419e569a124fc35e0e'
        },
        aggregatorUrl: 'https://api-sui.cetus.zone/router'
}

//import NonceFinder from '../NonceFinder.js';
class MiningData {
  constructor(mineid) {
    this.mineid = mineid;
  }
}
export default class FomoMiner {
    constructor(params = {}) {
        this._suiMaster = params.suiMaster || null;
        this._buses = params.buses || null;
        this._configId = params.configId || null;
        this._packageId = params.packageId || null;
        this._miners = [];
        this._key = params.key;
        this._config = null;
        this._movePackage = null;
    }


    async checkObjects() {
        if (this.__checkObjectsPromise) {
            return await this.__checkObjectsPromise;
        }
        this.__checkObjectsPromiseResolver = null; // to be sure it's executed once async
        this.__checkObjectsPromise = new Promise((res)=>{ this.__checkObjectsPromiseResolver = res; });

        if (!this._packageId ) {
            throw new Error('NAILONG | packageId are required');
        }
        const SuiObject = suidouble.SuiObject;
        // this._treasury = treasury;
        const movePackage = this._suiMaster.addPackage({
            id: this._packageId,
        });
        await movePackage.isOnChain(); // check the package on the blockchain

        this._movePackage = movePackage;

        this.__checkObjectsPromiseResolver(true); // initialized

        return true;
    }

    async getOrCreateMiner() {
        if (this._suiMaster._debug) {
            console.log('NAILONG | Trying to find the miner object already registered on the blockchain....');
        }
        const paginated = await this._movePackage.modules.coin.getOwnedObjects({ typeName: 'UserTimestore' });
        let miner = null;
        this._miners = [];
        await paginated.forEach((suiObject)=>{ 
            miner = suiObject; 
            //console.log(miner.stake_metadata);
            this._miners.push(miner);
            });
        if (miner) {
           if(this._miners.length >= 1){
                console.log(this._suiMaster.address,'NAILONG | 当前子objectID数:',this._miners.length);
			   return miner;
		   }
        }
        const tx = new suidouble.Transaction();
        const moveCallResults = [];
        console.log(this._suiMaster.address,'NAILONG | 需要注册子objectID 当前ID数:',this._miners.length);
        const regnum = 10 - this._miners.length;
        for (let i = 0; i < regnum; i++) {
            const moveCallResult = tx.moveCall({
            target: `${this._packageId}::coin::create_timestore`,  
            arguments: [],  
            });
            moveCallResults.push(moveCallResult);
        }
        result = await this._suiMaster.signAndExecuteTransaction({
        transaction: tx,
        sender: this._suiMaster.address,
        options: {
            showEffects: true,  
        },
        });
        console.log('NAILONG | 子ID注册成功');
        //await this._movePackage.modules.miner.moveCall('register', []);
        await new Promise((res)=>{ setTimeout(res, 3000); });
        return await this.getOrCreateMiner();
    }

    async fetchBus(miner) {

        const bus = new (this._suiMaster.SuiObject)({ id: miner, suiMaster: this._suiMaster });
        await bus.fetchFields();
        return bus;
    }

    async hasBlockInfoChanged(oldHash) {
        const miner = await this.getOrCreateMiner();
        const newHash = new Uint8Array(miner.fields.current_hash); 
        if (bytesTou64(oldHash) != bytesTou64(newHash)) {
            return true;
        }
        return false;
    }
    async getOrCreateMinerWithNewerVersion(oldVersion, timeout) {
        let miner = await this.getOrCreateMiner();
        if (!oldVersion) {
            return miner;
        }
        let startCheckingAt = (new Date()).getTime();
        while (miner.version == oldVersion) {
            console.log('NAILONG | Waiting for the miner hash with updated version...');
            await new Promise((res)=>setTimeout(res, 1000));
            miner = await this.getOrCreateMiner();
            if ((new Date()).getTime() - startCheckingAt > timeout) {
                console.log('NAILONG | Using the current miner hash');
                return miner;
            }
        };
        return miner;
    }
    async swapsui(sendAmount, address) {
        const mainnetSDK = new CetusClmmSDK(mainnet);
        mainnetSDK.senderAddress = address;
        const pool = await mainnetSDK.Pool.getPool(
        "0xdbf66a55c1c4054b4d2dda7f410a1aa875a9ae149643a15bd8863032bcc2395f");
        const a2b = true;
        const byAmountIn = true;
        const amount = new BN(sendAmount);
        const slippage = Percentage.fromDecimal(d(5));
        const swapTicks = await mainnetSDK.Pool.fetchTicks({
            pool_id: pool.poolAddress,
            coinTypeA: pool.coinTypeA,
            coinTypeB: pool.coinTypeB,
        });
        const res = mainnetSDK.Swap.calculateRates({decimalsA: 2,decimalsB: 9,a2b,byAmountIn,amount,swapTicks,currentPool: pool,});
        const toAmount = byAmountIn
            ? res.estimatedAmountOut
            : res.estimatedAmountIn;
        const amountLimit = adjustForSlippage(toAmount, slippage, !byAmountIn);
        return parseFloat(amountLimit.toString()) / 10 ** 9;
        }

    async swapsdk(sendAmount, address, signer) {
        const mainnetSDK = new CetusClmmSDK(mainnet);
        mainnetSDK.senderAddress = address;
        const pool = await mainnetSDK.Pool.getPool(
        "0xdbf66a55c1c4054b4d2dda7f410a1aa875a9ae149643a15bd8863032bcc2395f");
        const a2b = true;
        const byAmountIn = true;
        const amount = new BN(sendAmount);
        const slippage = Percentage.fromDecimal(d(5));
        const swapTicks = await mainnetSDK.Pool.fetchTicks({
            pool_id: pool.poolAddress,
            coinTypeA: pool.coinTypeA,
            coinTypeB: pool.coinTypeB,
        });
        const res = mainnetSDK.Swap.calculateRates({decimalsA: 2,decimalsB: 9,a2b,byAmountIn,amount,swapTicks,currentPool: pool,});
        const toAmount = byAmountIn
            ? res.estimatedAmountOut
            : res.estimatedAmountIn;
        const amountLimit = adjustForSlippage(toAmount, slippage, !byAmountIn);
        try{
            const swapPayload = await mainnetSDK.Swap.createSwapTransactionPayload({
                pool_id: pool.poolAddress,
                coinTypeA: pool.coinTypeA,
                coinTypeB: pool.coinTypeB,
                a2b,
                by_amount_in: byAmountIn,
                amount: res.amount.toString(),
                amount_limit: amountLimit.toString(),});
            if (signer) {
		        const transferTxn = await mainnetSDK.fullClient.sendTransaction(
                signer,
                swapPayload
                );
                if (transferTxn && transferTxn.digest) {
                    console.log(address,"  卖出完毕! 交易hash ",transferTxn.digest);
                }else {
                    console.log("swap失败 钱包大概率被锁.等待下个纪元");
                }
            } else {
        console.log(address,"  issue with signer");
        }}catch (e) {
            console.log("swap失败 重试");
            return(this.swapsdk(sendAmount, address, signer));
            //console.error("swap error",(''+e).split("\n")[0]);
        }
    }
    async mergeCoins() {
        const tx = new suidouble.Transaction();
        const coinObjectIds = [];
        let cursor = null;
        const client = new SuiClient({ url: mairpc[Math.floor(Math.random() * mairpc.length)] });
        try {
        while (coinObjectIds.length < 500) { // 循环直到收集到 500 个对象
            const objectListResponse = await client.getCoins({
                owner: this._suiMaster.address,
                coinType: "0x02405148c5b453a70e8c20ee0002798e989048d1effba8bcf10068c61098c5bd::coin::COIN",
                cursor: cursor,
                limit: 50 // 每次请求最多 50 个对象
            });
            const objectList = objectListResponse.data;
            console.log(`获取到的对象数量: ${objectList.length}`);
            if (objectList.length === 0) {
                console.log(this._suiMaster.address, "没有更多对象可供获取");
                break; // 如果没有更多对象，则退出循环
            }
            coinObjectIds.push(...objectList.map(item => item.coinObjectId)); // 收集对象 ID
            cursor = objectListResponse.nextCursor; // 更新游标以获取下一页
        }

        if (coinObjectIds.length >= 2) { // 确保至少有两个对象以进行合并
            const firstObjectId = coinObjectIds.shift(); // 获取第一个对象 ID
            const remainingObjectIds = coinObjectIds.map(id => tx.object(id)); // 创建交易对象
            tx.mergeCoins(tx.object(firstObjectId), remainingObjectIds); // 合并对象
            const mergeResult  = await this._suiMaster.signAndExecuteTransaction({ 
                transaction: tx, 
                requestType: 'WaitForLocalExecution',
                sender: this._suiMaster.address,     
            });
            console.log(this._suiMaster.address, "NAILONG | 成功合并");
            return true;
        } else {
            console.log(this._suiMaster.address, "NAILONG | 不需要合并 当前游标对象数量:", coinObjectIds.length);
            //return false;
        }
    } catch (error) {
        console.error("合并过程中出错:",error);
        return false;
    }
    }
    async swap() {
        try{
            const client = new SuiClient({ url: mairpc[Math.floor(Math.random() * mairpc.length)] });
            const balanceInfo = await client.getBalance({
                owner: this._suiMaster.address,
                coinType: "0x02405148c5b453a70e8c20ee0002798e989048d1effba8bcf10068c61098c5bd::coin::COIN",
                limit: 1
                });
            const totalBalanceFomo = balanceInfo.totalBalance;
            const coinObjectCount = balanceInfo.coinObjectCount;
            const suibalance = await client.getBalance({
                owner: this._suiMaster.address,
                coinType: "0x2::sui::SUI", 
                limit: 1
                });
            const balanceInSUI = suibalance.totalBalance / 1e9; // 转换为 SUI    
            if (parseFloat(coinObjectCount) >= 500) {
                const price = Number(await this.swapsui(totalBalanceFomo,this._suiMaster.address)).toFixed(4);
                console.log(this._suiMaster.address,"500个合并一次 对象数：" + coinObjectCount,"价值:",price,"钱包余额:",balanceInSUI,"sui")
                await this.mergeCoins();
                if (price >= 0.4){
                    //console.log(this._suiMaster.address,"价值大于0.2sui 开始swap 钱包余额:",balanceInSUI,"sui");
                    //await this.swapsdk(totalBalanceFomo, this._suiMaster.address, this._suiMaster._signer);
                }
                const newbalanceInfo = await client.getBalance({
                    owner: this._suiMaster.address,
                    coinType: "0x02405148c5b453a70e8c20ee0002798e989048d1effba8bcf10068c61098c5bd::coin::COIN",
                    limit: 1
                });
                console.log(this._suiMaster.address, " 合并后NAILONG对象：" + newbalanceInfo.coinObjectCount);
            } else{
                console.log(this._suiMaster.address,"500个合并一次 对象数：" + coinObjectCount,"钱包余额:",balanceInSUI,"sui")
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
            }catch (error) {
            console.error('Error in swap operation:', error.message);
            return false;
        }
    }
    async mine() {
        try{
        if(!await this.checkObjects()){
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
        }
        await this.getOrCreateMinerWithNewerVersion(this.__lastMinerObjectVersion, 3000);
        //const swapres = await this.swap();
        //if (!swapres){
        //    return true;
        //}
        }catch (e) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return true;
        }
        const txs = [];
        const signerAddressBytes = bcs.Address.serialize(this._suiMaster.address).toBytes();

        const miningPromises = this._miners.slice(0, 10).map(async (miner,index) => {
        let buss = await this.fetchBus(miner.id);
        while (!this.busIsOk(buss)){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        const startFindingNonceAt = (new Date()).getTime();
        let foundValid = false;
        while (!foundValid) {
            let abab = 5;
            let nonce = BigInt(abab);
            if (nonce !== null) {
                txs.push(new MiningData(miner.id));
                foundValid = true;
            }

        }
    });
    await Promise.all(miningPromises);
    if (!await this.submit(txs)) {
        return false;
    }
    return true;
}
    busIsOk(bus) {
        let threshold = Number(bus.fields.last_mint_time);
        let buffer = 5;
        let resetTimeOk = Date.now() > threshold + buffer;
        return resetTimeOk;
    }
    async submit(txs, maxRetries = 1, retryDelay = 2000) {
        let tx = new suidouble.Transaction();
        let moveCallResults = [];
        const suiMasterParams = {
            client: null,
        };
        const randomstr =subrpc[Math.floor(Math.random() * subrpc.length)];
        const rpcClient = new SuiClient({
            transport: new SuiHTTPTransport({
                url: randomstr,
            }),
        });
        suiMasterParams.client = rpcClient;
        suiMasterParams.privateKey = this._key;
        const suiMaster = new SuiMaster(suiMasterParams);
        await suiMaster.initialize();
        const processCount =  1;
    //const processCount = Math.floor(txs.length / 10) * 10;
    for (let i = 0; i < processCount; i++) {
        let args = [
            tx.object("0x1f9eb09e038cad251fcc898994c2da9d3683c89dbc4387cf542e43b9131d2075"),
            tx.object(txs[i].mineid), // miner
            tx.object('0x0000000000000000000000000000000000000000000000000000000000000006'), // clock
        ];
        let moveCallResult = tx.moveCall({
            target: `${this._packageId}::coin::MINT`,
            arguments: args,
        });
        moveCallResults.push(moveCallResult);
    }

    if (moveCallResults.length > 0) {
        //tx.transferObjects(moveCallResults, this._suiMaster.address);
        tx.setGasBudget(100009712);
    }
        try {
            const r = await suiMaster.signAndExecuteTransaction({
                transaction: tx,
                sender: this._suiMaster.address,
                requestType: 'WaitForLocalExecution',
                options: {
                    showEffects: true,
                },
            });
            if (r && r.effects && r.effects.status && r.effects.status.status === 'success') {
                console.log(this._suiMaster.address, 'NAILONG | 打包提交',processCount,'个对象 成功!');
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return true;
            } else {
                console.log(this._suiMaster.address, 'NAILONG | 打包提交失败');
                return true;
            }
        } catch (e) {
            const errorMessage = e.toString(); // 将错误对象转换为字符串
            if ((errorMessage.match(/stake/g) || []).length >= 1){
                console.log(this._suiMaster.address, `打包提交失败 账户被锁2次。等待下个纪元解锁 结束循环`);
                return false;
            } 
            else if (errorMessage.includes('timed')) {
                    console.log(this._suiMaster.address, `NAILONG | 提交出现timed out`);
                    return true;
                    //return this.submit(txs);
                }
            else{
                    console.log(this._suiMaster.address, `NAILONG | 打包提交失败 错误代码: ${errorMessage}`);
                    //await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return true;
                }
            }
    //console.log(this._suiMaster.address, `FOMO | 超过最大重试次数 ${maxRetries}, 任务失败`);
    //return false;
         }

    async waitUntilNextReset(currentReset) {
        const epochLength = 60000;
        const bus = await this.fetchBus();
        const nextReset = Number(bus.fields.last_reset) + epochLength;
        const timeUntilNextReset = nextReset - Date.now();

        if (timeUntilNextReset > 0) {
            await new Promise((res)=>setTimeout(res, timeUntilNextReset));
        }

        while (true) {
            const freshBus = await this.fetchBus();
            if (Number(freshBus.fields.last_reset) !== Number(currentReset)) {
                return true;
            } else {
                if (Date.now() > nextReset + 12000) {
                    return false;
                }
                await new Promise((res)=>setTimeout(res, 1500));
            }
        }
    }

}
