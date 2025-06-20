# Blokzincir Oylama Uygulaması

Bu proje, Sepolia ağı üzerinde çalışan bir merkeziyetsiz oylama uygulamasıdır. Solidity ile yazılmış bir akıllı sözleşme (Smart Contract) ve React tabanlı bir frontend arayüzü içerir.

---

## Gerekli Kurulumlar ve Bağımlılıklar

### Blockchain (Hardhat) Kurulumu

```bash
cd blockchain
npm install
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

#### Eğer hata alırsanız:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox --legacy-peer-deps
```

#### Eksik Bağımlılıkları Yüklemek için:
```bash
npm install --save-dev "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-ignition-ethers@^0.15.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-verify@^2.0.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "chai@^4.2.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "ts-node@>=8.0.0" "typechain@^8.3.0" "typescript@>=4.5.0" --legacy-peer-deps
```

### Ignition Kurulumu (Deploy işlemleri için)

```bash
npm install --save-dev @nomicfoundation/hardhat-ignition@^0.15.11 @nomicfoundation/ignition-core@^0.15.11 --legacy-peer-deps
npm install bip39 --legacy-peer-deps
```

---

## Komutlar

### Solidity Kodlarını Derlemek

```bash
npx hardhat compile
```

> Başarılı olursa `artifacts` klasörü oluşur ve sözleşmenin derlenmiş hali oraya eklenir.

### Sözleşmeyi Deploy Etmek

```bash
npm run deploy
```

> Not: Bu komut `scripts/deploy.js` dosyasını `sepolia` ağına çalıştıracak şekilde `package.json` içinde tanımlanmış olmalıdır.

### Testleri Çalıştırma

```bash
npm test

---

## Frontend Kurulumu (React App)

```bash
cd my-voting-app
npm install
```

### Uygulamayı Başlatma

```bash
npm start
```
---

## Proje Özellikleri

-  Oy kullanımı yalnızca seçmen listesinde olan kullanıcılar için mümkündür.
-  Seçmenler yalnızca bir kez oy kullanabilir.
-  Seçmen olmayanlar oy kullanamaz.
-  Oylamayı yalnızca sözleşme sahibi sonlandırabilir.
-  Oylama tamamlandıktan sonra oy kullanılamaz.
-  Tüm kontroller sözleşme üzerinde yapılmakta; kullanıcı arayüzü sadece hata mesajlarını göstermektedir.

---

## Notlar

- Sepolia test ağı üzerinde çalışmak için Metamask ve Sepolia ETH gereklidir.
- Proje Ethereum test ağı (Sepolia) üzerinde çalışacak şekilde yapılandırılmıştır.
- Kullanıcı arayüzünde ekstra kontrol yapılmaz, kontrol tamamen akıllı sözleşme tarafından yapılır ve hata mesajı sözleşmeden alınarak kullanıcıya gösterilir.