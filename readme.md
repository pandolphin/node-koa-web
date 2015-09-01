## 环境依赖

* node v0.12.0
* nvm

## 怎么run起来

用nvm来控制node环境的版本, nvm的安装方法参考：[link](https://github.com/creationix/nvm)

```
nvm install v0.12.0
nvm use v0.12.0
```

安装依赖包

```
npm install 
or
npm install --registry=https://r.cnpmjs.org（国内源）
or
tnpm install（阿里源）
```
启动服务

```
cd $project_dir
NODE_ENV=development node --harmony app.js
```
绑定host
将127.0.0.1绑定至base.com域下
访问xxx.base.com:7001

找不到tms-stage，根据提示建一个这样的文件夹
