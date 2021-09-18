const controls = [
  {
    action: 'create.start-event',
    title: '开始',
  },
  {
    action: 'create.intermediate-event',
    title: '中间',
  },
  {
    action: 'create.end-event',
    title: '结束',
  },
  {
    action: 'create.exclusive-gateway',
    title: '网关',
  },
  {
    action: 'create.task',
    title: '任务',
  },
  {
    action: 'create.user-task',
    title: '用户任务',
  },
  {
    action: 'create.user-sign-task',
    title: '会签任务',
  },
  {
    action: 'create.subprocess-expanded',
    title: '子流程',
  },
  {
    action: 'create.data-object',
    title: '数据对象',
  },
  {
    action: 'create.data-store',
    title: '数据存储',
  }, {
    action: 'create.participant-expanded',
    title: '扩展流程',
  },
  {
    action: 'create.group',
    title: '分组',
  },
];

//  获取控件配置信息
const getControl = (action) => {
  const result = controls.filter(item => item.action === action);
  return result[0] || {};
};

export const adjustPalette = (canvas) => {
  try {
    // 获取 bpmn 设计器实例
    const djsPalette = canvas.children[0].children[1].children[4];
    const djsPalStyle = {
      width: '110px',
      padding: '5px',
      background: 'white',
      left: '20px',
      borderRadius: 0,
    };
    for (const key in djsPalStyle) {
      djsPalette.style[key] = djsPalStyle[key];
    }
    const palette = djsPalette.children[0];
    const allGroups = palette.children;
    // allGroups[0].style['display'] = 'none'
    // 修改控件样式
    for (var gKey in allGroups) {
      const group = allGroups[gKey];
      for (var cKey in group.children) {
        const control = group.children[cKey];
        const controlStyle = {
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: '5px',
        };
        if (control.className && control.dataset && control.className.indexOf('entry') !== -1) {
          const controlProps = getControl(control.dataset.action);
          control.innerHTML = `<span style='font-size: 12px;margin-left:5px;'>${controlProps['title']}</span>`;
          for (const csKey in controlStyle) {
            control.style[csKey] = controlStyle[csKey];
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};
