//import { INSPIRE_API_CONSTS } from '../consts/InspireAPIConsts';

export const serializeParams = data => {
	return Object.keys(data).map(function (keyName) {
		return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
	}).join('&');
}

export class InspireXApi {

	ologinresponse = null;
	address = '';

	constructor(address) {
		this.address = address;
	}

	async doLogin(username, password) {

		var client_id = '';
		var client_secret = '';
		try {
			const pcresponse = await fetch(this.address + '/api/passwordclient');
			if (pcresponse.status < 400) {
				const opcresponse = await pcresponse.json();
				client_id = opcresponse.id;
				client_secret = opcresponse.secret;
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}

		const formData = new FormData()
		//formData.append('client_id', INSPIRE_API_CONSTS.client_id);
		//formData.append('client_secret', INSPIRE_API_CONSTS.client_secret);
		formData.append('client_id', client_id);
		formData.append('client_secret', client_secret);
		formData.append('grant_type', 'password');
		formData.append('username', username);
		formData.append('password', password);
		//console.log(formData);
		// const sdata = serializeParams({
		// 	client_id: '917d7759-25cb-4519-9903-04598452e629',
		// 	client_secret: 'Euma8nWkuGHzf7GdaOr53LQT58IxISOZSLQq0JBt',
		// 	grant_type: 'password',
		// 	username: username,
		// 	password: password
		// });

		//const response = await fetch(INSPIRE_API_CONSTS.address + '/oauth/token', {
		const response = await fetch(this.address + '/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				//'Content-Length': contentLength,
				'Accept': 'application/json'
			},
			body: formData
		});
		//console.log(response.status);
		if (response.status < 400) {
			const oresponse = await response.json();
			this.ologinresponse = oresponse;
			return oresponse;
		} else {
			return null;
		}
	}

	async doFetchProdutos(search = '', page = null, per_page = null) {
		var aqueryparams = [];
		if (page != null) {
			aqueryparams.push('page=' + page);
		}
		if (per_page != null) {
			aqueryparams.push('per_page=' + per_page)
		}
		if (search != null && search != '') {
			aqueryparams.push('search=' + search);
		}
		var squeryparams = aqueryparams.join('&');
		if (squeryparams != '') {
			squeryparams = '?' + squeryparams;
		}
		//console.log(squeryparams);
		//const response = await fetch(INSPIRE_API_CONSTS.address + '/api/pro/produtos' + squeryparams, {
		const response = await fetch(this.address + '/api/pro/produtos' + squeryparams, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	async doGetParFaturamento(filial_par, codigo) {
		const response = await fetch(this.address + '/api/par/faturamentos/' + filial_par + '/' + codigo, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	async doGetBasAlmoxarifado(filial, codigo) {
		const response = await fetch(this.address + '/api/bas/almoxarifados/' + filial + '/' + codigo, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	async doGetParEstoque(filial) {
		const response = await fetch(this.address + '/api/par/estoques/' + filial, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	async doGetBasTipoMov(codigo) {
		const response = await fetch(this.address + '/api/bas/tipomovs/' + codigo, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	async doFetchReportTotalDeVendasDoDia(dia) {
		const response = await fetch(this.address + '/api/view/vnd/padrao/totalvendasdia' + (dia == null ? '' : '/' + dia), {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.ologinresponse.access_token
			}
		});
		const oresponse = await response.json();
		return oresponse;
	}

	getLoginResponse() {
		return this.ologinresponse;
	}
}
