import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTask,status,summary,dateOffset,day,validateData} from '../src/model.js';
const task={id:'t',name:'原型设计',owner:'小林',phase:'设计',notes:'',start:'2026-10-01',end:'2026-10-05',progress:40};
test('日期范围与进度必须有效',()=>{assert.throws(()=>validateTask({...task,end:'2026-09-30'}));assert.throws(()=>validateTask({...task,progress:101}));assert.equal(validateTask({...task,progress:'50'}).progress,50);});
test('区分完成、延期、进行中和未开始',()=>{assert.equal(status(task,'2026-10-06'),'已延期');assert.equal(status({...task,progress:100},'2026-10-06'),'已完成');assert.equal(status(task,'2026-10-03'),'进行中');assert.equal(status({...task,progress:0},'2026-10-03'),'未开始');});
test('整体进度计算与空项目',()=>{assert.equal(summary([task,{...task,progress:100}]).progress,70);assert.equal(summary([]).progress,0);});
test('甘特图日期跨月准确且包含结束日',()=>{assert.equal(dateOffset('2026-10-31',1),'2026-11-01');assert.equal(day('2026-11-02')-day('2026-10-31')+1,3);});
test('备份校验防止损坏数据覆盖',()=>{assert.equal(validateData({version:1,projects:[{id:'p',name:'项目',tasks:[task]}]}).projects.length,1);assert.throws(()=>validateData({projects:[]}));assert.throws(()=>validateData({version:1,projects:[{id:'p',name:'项目',tasks:[{...task,owner:5}]}]}));});
