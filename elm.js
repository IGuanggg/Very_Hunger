/**
 * cron: 11 8,13,20 * * *
 * 只添加这个定时就可以了 自己修改下面脚本路径就可以自动一键启动全部 
 *饿了么一键全任务-可自己关了 单独运行
 */

const { exec } = require('child_process');

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const command = `node ${scriptPath}`;
    const childProcess = exec(command);
    childProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`[${scriptPath}] stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
  });
}

const scripts = [
  '/ql/scripts/IGuanggg_elm_ebe/elm_2048.js',
  '/ql/scripts/IGuanggg_elm_ebe/elm_elge.js',
  '/ql/scripts/IGuanggg_elm_ebe/elm_hctmm',
  '/ql/scripts/IGuanggg_elm_ebe/elm_cycg.js',
  '/ql/scripts/IGuanggg_elm_ebe/elm_mst.js',
  '/ql/scripts/IGuanggg_elm_ebe/elm_lyb.js',
  '/ql/scripts/IGuanggg_elm_ebe/elm_assest.js'
];

async function runScripts() {
  for (const script of scripts) {
   // console.log(`查找: ${script}`);
    try {
      await runScript(script);
    } catch (error) {
      console.error(`Error running script ${script}:`, error);
    }
  }
}

// 执行所有脚本
runScripts();
