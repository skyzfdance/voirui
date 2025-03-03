<template>
  <BasicForm :schemas="schemas" />
</template>

<script setup lang="ts">
  import { BasicForm, type SchemaProps } from "/@/components/Form"

  defineOptions({ name: "Dashboard" })

  const schemas: SchemaProps[] = [{ name: "name", label: "姓名", component: "Input" }]
</script>
