<template>
	<div class="startWrapper">
		<div class="posCenter">
			<div class="desc">极限生存</div>
			<router-link to="./Drawing" tag="div" class="startBtn">
				Start
			</router-link>
			<div class="authod">开发者：Lam Zing-Man</div>			
		</div>
	</div>
</template>

<script>
export default{
	name:'Start',
	data(){
		return{

		}
	}



}

</script>

<style lang="stylus" scoped>
	.startWrapper
		background-color grey
		position absolute
		width 100%
		height 100%
		overflow hidden
		.posCenter
			width 100%
			text-align center
			.desc
				margin-top 3rem
				color white
				font-size 1rem
			.startBtn
				margin 1rem auto
				font-size .7rem
				text-align center
				line-height 3rem
				background-color green
				border-radius 50%
				width 3rem
				height 3rem
			.authod
				position relative
				top 1rem
				color white
	

</style>