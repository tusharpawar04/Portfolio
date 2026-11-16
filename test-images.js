// Quick test to verify project images
import { projects } from './src/data.ts'

console.log('=== PROJECT IMAGES TEST ===\n')

projects.forEach((p, idx) => {
  console.log(`${idx + 1}. ${p.title} (${p.slug})`)
  console.log(`   Has images: ${!!p.images}`)
  console.log(`   Image count: ${p.images?.length || 0}`)
  if (p.images && p.images.length > 0) {
    p.images.forEach((img, imgIdx) => {
      console.log(`   [${imgIdx}] ${img.url}`)
    })
  }
  console.log('')
})
