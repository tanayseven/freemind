<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js"

  export let status: string
</script>

<span>
  <Badge variant={status === "Active" ? "default" : "outline"} disabled={status === "Inactive"}>
    {status}
  </Badge>
</span>
