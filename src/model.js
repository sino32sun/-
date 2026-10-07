export const uid = () => crypto.randomUUID();
export const today = () => new Date().toLocaleDateString('en-CA');
export function day(value) { return Date.parse(`${value}T00:00:00Z`) / 86400000; }
export function dateOffset(value, offset) { return new Date((day(value) + offset) * 86400000).toISOString().slice(0, 10); }
export function validateTask(task) {
  if (!task.name?.trim()) throw new Error('请输入任务名称');
  if (!Number.isFinite(day(task.start)) || !Number.isFinite(day(task.end))) throw new Error('请选择有效的开始和结束日期');
  if (task.end < task.start) throw new Error('结束日期不能早于开始日期');
  if (!Number.isFinite(Number(task.progress)) || Number(task.progress) < 0 || Number(task.progress) > 100) throw new Error('进度须在 0–100 之间');
  return {...task, name: task.name.trim(), progress: Number(task.progress)};
}
export function status(task, current = today()) {
  return task.progress === 100 ? '已完成' : task.end < current ? '已延期' : task.progress > 0 ? '进行中' : '未开始';
}
export function summary(tasks) {
  return {total: tasks.length, completed: tasks.filter(t => t.progress === 100).length, progress: tasks.length ? Math.round(tasks.reduce((s,t) => s+t.progress,0)/tasks.length) : 0, overdue: tasks.filter(t=>status(t)==='已延期').length};
}
export function validateData(data) {
  if (data?.version !== 1 || !Array.isArray(data.projects)) throw new Error('文件不是有效的项目罗盘备份');
  const ids = new Set();
  for (const p of data.projects) {
    if (!p || typeof p.id !== 'string' || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || !Array.isArray(p.tasks)) throw new Error('项目数据不完整');
    ids.add(p.id);
    const taskIds = new Set();
    for (const t of p.tasks) {
      if (!t || typeof t.id !== 'string' || taskIds.has(t.id) || typeof t.name !== 'string' || typeof t.owner !== 'string' || typeof t.phase !== 'string' || typeof t.notes !== 'string') throw new Error('任务数据不完整');
      taskIds.add(t.id); validateTask(t);
      if (typeof t.progress !== 'number') throw new Error('任务进度格式无效');
    }
  }
  return data;
}
export function demo() {
  const base=today();
  return {version:1, projects:[{id:uid(),name:'品牌官网改版', description:'从项目启动到正式上线，让每一步都有迹可循。',tasks:[
    ['项目启动与目标对齐','林晓','项目启动',-5,-3,100],['需求访谈与梳理','陈悦','项目启动',-3,2,80],['信息架构与原型','林晓','设计阶段',0,7,45],['视觉方案设计','王宁','设计阶段',3,11,20],['前端页面开发','李然','开发阶段',8,19,0],['内容整理与录入','陈悦','开发阶段',10,18,0],['测试与验收','王宁','交付上线',20,24,0],['正式上线与复盘','林晓','交付上线',25,27,0]
  ].map(([name,owner,phase,start,end,progress])=>({id:uid(),name,owner,phase,start:dateOffset(base,start),end:dateOffset(base,end),progress,notes:''}))}]};
}
