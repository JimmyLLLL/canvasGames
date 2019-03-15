<template>
	<div class="detailWrapper">
		<div class="backBtn" @click="handleRouterClick">←</div>
		<div class="detailTitle">巅峰榜</div>
		<ul class="scoreUl">
			<li v-for="(item,index) in score" class="scoreLi">第{{index+1}}名：{{item}}</li>
		</ul>
		<div class="clearRecord" @click="handleClearRecord">清除记录</div>
	</div>
</template>

<script>
export default{
	name:'Gameover',
	data(){
		return{
			score:[]
		}
	},
	methods:{
		handleRouterClick(){
			this.$router.push({path:'/Gameover'})
		},
		getStorageData(){
			const storage = window.localStorage
			let score = storage.getItem('record')
			score = JSON.parse(score)
			function middleDis(a,b){
				if(a>b){
					return -1
				}else if(a<b){
					return 1
				}else{
					return 0
				}
			}
			this.score = score.sort(middleDis)
		},
		handleClearRecord(){
			this.score = []
			const storage = window.localStorage
			storage.setItem('record',[])
		}
	},
	mounted(){
		this.getStorageData()
	}
}
</script>

<style lang="stylus" scoped>
	.detailWrapper
		position absolute
		height 100%
		width 100%
		background-color black
		padding 0 .4rem
		box-sizing border-box
		overflow hidden
		.backBtn
			z-index 99
			position absolute
			color white
			left .2rem
			font-size 1rem
			height 1.4rem
			line-height 1.4rem
		.detailTitle
			text-align center
			width:100%
			height 1.6rem
			line-height 1.6rem
			position absolute
			font-size 1.0rem
			color yellow
		.scoreUl
			border-radius .8rem
			padding .4rem 0
			height 9rem
			margin-top 1.6rem
			background-color red
			overflow scroll
			list-style none
			padding-left 2.4rem
			.scoreLi
				font-size .4rem
				color white
				margin-bottom .2rem
		.clearRecord
			position relative
			width:100%
			text-align center
			color white
			margin-top .3rem
			font-size .3rem
				
			
</style>