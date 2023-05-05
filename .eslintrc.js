module.exports={
    root:true,
    env:{
        node:true,
    },
    // 继承React官方规则
    extends:["plugin:vue/vue3-essential","eslint:recommended"],
    parserOptions:{
        parser:"@babel/eslint-parser",
    }
    // rules:{
    //     "no-var":2,//不使用var 定义变量
    // },
    // plugins:["import"],//import 解决动态导入语法报错问题

}