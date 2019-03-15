<template>
	<div class="overWrapper">
		<div class="yourDesc">
			孤立无援中，你生存了
		</div>
		<div class="scoreDescWrapper">
			<div class="scoreDesc">
				{{yourScore}}秒
			</div>			
		</div>

		<div class="rankDesc">
				在好友中排第{{rank}}/{{totalNum}}名		
		</div>

		<router-link to="./scoreDetail" tag="div" class="seeDetail">
			查看详情
		</router-link>
		<router-link to="./" tag="div" class="backHome">
			回到主界面
		</router-link>
		<router-link to="./Drawing" tag="div" class="restartDesc">
		重新再战
		</router-link>
	</div>
</template>

<script>
export default{
	name:'Gameover',
	data(){
		return{
			score:[],
			yourScore:0,
			rank:0,
			totalNum:0
		}
	},
	methods:{
		getStorageData(){
			const storage = window.localStorage
			let score = storage.getItem('record')
			try{
				this.score = JSON.parse(score)
				const arr = this.score
				const len = arr.length
				this.totalNum = len
				this.yourScore = arr[len-1]	
			}catch(e){
			}
			

		},
		rankData(){
			const that = this
			let arr = this.score
	    const storage = window.localStorage
			function middleDis(a,b){
				if(a>b){
					return -1
				}else if(a<b){
					return 1
				}else{
					return 0
				}
			}
			arr = arr.sort(middleDis)
			this.rank = arr.indexOf(that.yourScore)+1
			//排好序的数组直接返回存储，一步到位
			try{
				arr = JSON.stringify(arr)
	      storage.setItem('record',arr)
			}catch(e){
			}


		}
	},
	mounted(){
		this.getStorageData()
		this.rankData()
	}
}
	
</script>

<style lang="stylus" scoped>
	.overWrapper
		position absolute
		width 100%
		height 100%
		overflow hidden
		background-color #cccccc
		text-align center
		.rankDesc
			font-size .4rem
			margin-top .4rem
		.seeDetail
			font-size .4rem
			color red
			margin-top .4rem
		.yourDesc
			margin-top 2.5rem
			font-size .4rem
		.scoreDescWrapper
			margin-top .6rem
			width 100%
			.scoreDesc
				margin 0 auto
				font-size .7rem
				text-align center
				line-height 2.5rem
				color white
				background-color green
				border-radius 50%
				width 2.5rem
				height 2.5rem
		.restartDesc
			font-size .8rem
			margin-top .6rem
		.backHome
			margin-top .6rem
			color green
			font-size .8rem
			
	
</style>