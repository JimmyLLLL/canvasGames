/*
* @Author: Venus-Lin
* @Date:   2018-11-21 23:10:27
* @Last Modified by:   Venus-Lin
* @Last Modified time: 2018-11-27 21:03:38
*/
export default ()=>{
	let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
	let htmlDom = document.getElementsByTagName('html')[0];
	if (htmlWidth > 750) {
		htmlWidth = 750;
	}
	htmlDom.style.fontSize = htmlWidth / 7.5 + 'px';
}