<script>

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    subMenuIcon: {
      type: Boolean,
      default: false,
    },
  },

  render(h, context) {
    const { icon, title, subMenuIcon, data } = context.props;
    const vnodes = [];

    if (subMenuIcon) {
      vnodes.push(<svg-icon icon-class={icon}/>);
    } else if (icon && data.parentId === "0") {
      vnodes.push(<svg-icon icon-class={icon}/>);
      // const node = (<span class={className} />);
      // vnodes.push(node);
    }
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>);
    }
    vnodes.push(<span class='item-bg'></span>);
    return vnodes;
  },
};
</script>
