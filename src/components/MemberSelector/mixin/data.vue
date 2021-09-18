<script>
import { isArray, isObject } from "@monkey.do/monkey";

export default {
  name: "MemberData",

  data() {
    return {
      checkedNode: [],
      errorMsg: "",
    };
  },

  watch: {
    defaultValue: {
      handler: function(value) {
        if (value && isArray(value)) {
          this.checkedNode = value.map(item => {
            if (isObject(item)) return item.id;
            return item;
          });
        }
        if (value && isObject(value)) {
          this.checkedNode = [value.id];
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
