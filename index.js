const Crunchbase = require('./crunchbase');
const axios = require('axios');

const crunchbase = new Crunchbase();

async function companies() {
    try {
        await crunchbase.connectMongoDB();

        await crunchbase.getCompanies();

        process.exit();

        // let lastUUID = await crunchbase.lastCompanyid();
        // debugger;
    
        // let index = 0;
    
        // while (lastUUID) {
        //     console.log(`Index: ${index} UUID: ${lastUUID}`)

        //     const data = await crunchbase.fetchCompanies(lastUUID);
    
        //     const { count, entities = [] } = data;
    
        //     let { uuid = '' } = entities.at(-1);
    
        //     const operations = crunchbase.prepareBulkOperation(entities);
    
        //     await crunchbase.insertCompanies(operations);

        //     lastUUID = uuid;

        //     index++;
        // }
    } catch(err) {
        console.log(err);
    }
}

async function investors() {
    try {
        const waitFor = [15000, 20000, 25000, 30000];

        await crunchbase.connectMongoDB();

        let lastUUID = await crunchbase.lastInvestorid();
    
        let index = 0;

        while (lastUUID) {
            const seconds = waitFor[Math.floor(Math.random() * waitFor.length)];

            await new Promise(resolve => setTimeout(resolve, seconds));

            console.log(`Index: ${index} UUID: ${lastUUID}`)

            const data = await crunchbase.fetchInvestors(lastUUID);
            debugger;

            const { count, entities = [] } = data;

            let { uuid = '' } = entities.at(-1);

            const operations = crunchbase.prepareBulkOperation(entities);

            await crunchbase.insertInvestors(operations);

            lastUUID = uuid;

            index++;
        }
    } catch(err) {
        console.log(err.response);
        throw err;
    }
}

async function cities() {
    try {
        await crunchbase.connectMongoDB();

        const cities = await crunchbase.getCities();

        for (let city of cities) {
            const { _id, name, state } = city;

            console.log(`City :: `, name);

            const resp = await crunchbase.geoCode(`${name}, ${state}`);

            await crunchbase.updateCity(_id, resp);

            // console.log(await crunchbase.geoCode(`${name}, ${state}`));
        }
    } catch(err) {
        console.log(err.response);
        throw err;
    }
}

async function justdialCities() {
    const response = await axios.get('https://www.justdial.com/api/india_api_write/commonapis/core_sitemap.php', {
      params: {
        'searchType': 'sitemap',
        'query': 'category',
        'city': 'Mumbai',
        'page': '1',
        'type': 'cities',
        'viewall': '1',
        'substring': 'A',
        'sieve': '{"name":"sitemapModel","selector":"sitemapViewall","runInit":true}',
        'wap': '2',
        'source': '2',
        'version': '5.6',
        'searchReferrer': 'gen',
        'utmCampaign': '',
        'utm_campaign': '',
        'referer': 'https://www.justdial.com/',
        'utm_source': '',
        'utm_medium': '',
        'lat': '',
        'long': '',
        'enc': '1',
        'env': 'p'
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        'if-none-match': 'W/"16b3-zpHw5GVBUgORZqg0xigHHbMm/L0"',
        'priority': 'u=1, i',
        'referer': 'https://www.justdial.com/dir/cities/A',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
      }
    });
  
    console.log(JSON.stringify(response.data));
}

async function linkedinScrapere() {
    const response = await axios.get('https://www.linkedin.com/sales-api/salesApiAccountSearch?q=searchQuery&query=(filters:List((type:COMPANY_HEADCOUNT,values:List((id:C,text:11-50,selectionType:INCLUDED),(id:D,text:51-200,selectionType:INCLUDED),(id:E,text:201-500,selectionType:INCLUDED))),(type:REGION,values:List((id:102713980,text:India,selectionType:INCLUDED)))))&start=1500&count=100&trackingParam=(sessionId:6Ttoe2KSQempNC5Dh0X9VQ%3D%3D)&decorationId=com.linkedin.sales.deco.desktop.searchv2.AccountSearchResult-4', {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en;q=0.9',
          'cookie': 'lang=v=2&lang=en-us; bcookie="v=2&6cb94a8f-017f-475c-88df-92daaf5d2f7b"; bscookie="v=1&20240802113828458aad86-bdb1-49e2-851e-8a98c5ef8d42AQHTVoUwaf7tHKwWBIVzxK_tB2YD5NZd"; _gcl_au=1.1.1843198403.1722598711; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; aam_uuid=44444859532301616920824585526478639560; g_state={"i_l":0}; liap=true; JSESSIONID="ajax:6267002767900358354"; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; li_sugr=f37c961c-b774-4346-a052-cfeb8ddfc4a0; _guid=fad3a202-a92b-439c-bda1-26fad3a7240b; AnalyticsSyncHistory=AQIRDb-ojEmTgAAAAZES5NxPB0nHlTk_KckWo3iO4RpA33f8j3CpJ2VeOizLnsMYoHeDXy7sy1qfOB5jmbqsog; lms_ads=AQENQCKbC8_fMQAAAZES5N3_3UKJvS8bjyy3rIlMrpYo-uZMN0uZ33DqZzH3cUFSYblYPhBk55seSGzTazzXXE7kzVYgf-Mw; lms_analytics=AQENQCKbC8_fMQAAAZES5N3_3UKJvS8bjyy3rIlMrpYo-uZMN0uZ33DqZzH3cUFSYblYPhBk55seSGzTazzXXE7kzVYgf-Mw; dfpfpt=08fedb927ca3488e943acdf737520f05; s_cc=true; s_ips=852; s_tp=852; gpv_pn=www.linkedin.com%2Fself-serve-checkout%2Forder-processing%2F963ba1dc-35e0-4678-82f9-47b74286e0adAQHEkOq66jQsIgAAAZES5qh59j4qKDINGfmZbnPMlneKKJz1plEBCGtyhsuT0tzkw5sGcSzEXRwEYULdxK9owh3w4hRn; s_sq=%5B%5BB%5D%5D; s_plt=4.79; s_pltp=www.linkedin.com%2Fself-serve-checkout%2Forder-processing%2F963ba1dc-35e0-4678-82f9-47b74286e0adAQHEkOq66jQsIgAAAZES5qh59j4qKDINGfmZbnPMlneKKJz1plEBCGtyhsuT0tzkw5sGcSzEXRwEYULdxK9owh3w4hRn; s_ppv=www.linkedin.com%2Fself-serve-checkout%2Forder-processing%2F963ba1dc-35e0-4678-82f9-47b74286e0adAQHEkOq66jQsIgAAAZES5qh59j4qKDINGfmZbnPMlneKKJz1plEBCGtyhsuT0tzkw5sGcSzEXRwEYULdxK9owh3w4hRn%2C100%2C100%2C852%2C1%2C1; s_tslv=1722599318757; _uetsid=bdee53f050c311ef8ff2d917429d3c83; _uetvid=bdee51a050c311ef8e8737413f0fab7b; li_at=AQEFAREBAAAAABC-BkgAAAGREuS9XwAAAZE2-EuyTQAAtHVybjpsaTplbnRlcnByaXNlQXV0aFRva2VuOmVKeGpaQUFDUGs0UFJSQXRVc3l3R0VRTGJiLzlrQkhFU0M4Ky9SUE1pTHhldnBPQkVRQ2FhQWt5XnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50OjIzNTQ4OTMxMywzNDMwODExMjMpXnVybjpsaTptZW1iZXI6MTEyMDczOTA3NV2yMutkrnj2-rH2eQoBidnPhE05zyPfF6wKjAc0Jxw_kcIqL5NixHxy_ACYc-c3tSi7Bf72fjY2jGGf8EkyPCExZNj6H9e4Jj8maNFfAxyvfDfKtgnnGV6DYhugmBNu-ROJMuDhCYXpsiZmvxYgKHgy15rzd45FOFa7iXHDCoXs-p9lZwl0bqSg_D6dbFwUbUChd4w; li_ep_auth_context=AHVhcHA9c2FsZXNOYXZpZ2F0b3IsYWlkPTIzNTQ4OTMxMyxpaWQ9MzE0MDM5MjY1LHBpZD0zNDMwODExMjMsZXhwPTE3MjUxOTEzMjc2OTUsY3VyPXRydWUsc2lkPTE1MDcyOTMxMTMsY2lkPTE3MzU2NDIxMDUB01NOtE5T_ITFojIHXTn-YbMXtDs; li_a=AQJ2PTEmc2FsZXNfY2lkPTMxNDAzOTI2NSUzQSUzQTMxMzk2MDA1NyUzQSUzQXRpZXIxJTNBJTNBMjM1NDg5MzEzxciMb944fIHrbm9Ze1oIYfMF_UQ; UserMatchHistory=AQLmBARUl21qawAAAZETmp7LeADsGX3xjdUQ8-ozN2SiCoYAzEzQV2Mk-95AzxjTCBW_w5r70eFZczxekH-ZOey2yLT1Qm2gVSdvFthXBWUzPpAym_grJFgJFABszaRHoulfRMrabfrR1zR81MzYg68JBeqtoiNMZB3EaQr95x1TfKqqIfeM8QCRC_DYAmj_mYQ0WUtp1C3ML58wC-wEssE1jAXCp1cLq2yk9rnzKz9G6EeVYc3-2V_AlvWvDNhNfeQD4T-qRXLjH5h9z6e9GEH9XVDwg-P2SnAOqLruz3j0LALjWWS-IgQ4hyiKHC4h1c9FKmRu714Zx8aA6xihBzg5kB1rpRJ13iGJnFcb9hR0F09Hdg; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19938%7CMCMID%7C44233301312854888550846301892517749251%7CMCAAMLH-1723215587%7C12%7CMCAAMB-1723215587%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1722617987s%7CNONE%7CvVersion%7C5.1.1%7CMCCIDH%7C1839390039; fptctx2=taBcrIH61PuCVH7eNCyH0HyAAKgSb15ZEqidLg30r8MDEYPeDDElaOWeQJiamMI22snbk518VH7Pz%252fHh5IcWqumUtsZ8Q9%252bx0PcIt4viPFLcYb1Nqa992dByjUk8JMBWlLFzDuVjDN1BzY2BHAP3r1%252byYJbDRJS5zIi3RqltyXs3xOJ%252b1gIcuDI3I1T8Yq%252bvugzi%252fBQ1zaGKGnp3nbHyyctPQT80Kfu1XiMHuXvnPa9G9cwHXbxeF0vj1RF3Ybs7tHukkiCfpngpS1bjGYkmPfk25Q3lQbMROLkot4%252fggYxqcSC75ufbMdfaBpjudErCfaXda28OPbc2EGZ1MLTXpUoflaVx79aE5vSnLLkrCSc%253d; lidc="b=OB75:s=O:r=O:a=O:p=O:g=3955:u=6:x=1:i=1722612240:t=1722614100:v=2:sig=AQF1l6vea_RA9Pxvza23Mk-CgzTKSyXr"',
          'csrf-token': 'ajax:6267002767900358354',
          'priority': 'u=1, i',
          'referer': 'https://www.linkedin.com/sales/search/company?page=3&query=(filters%3AList((type%3ACOMPANY_HEADCOUNT%2Cvalues%3AList((id%3AC%2Ctext%3A11-50%2CselectionType%3AINCLUDED)%2C(id%3AD%2Ctext%3A51-200%2CselectionType%3AINCLUDED)%2C(id%3AE%2Ctext%3A201-500%2CselectionType%3AINCLUDED)))%2C(type%3AREGION%2Cvalues%3AList((id%3A102713980%2Ctext%3AIndia%2CselectionType%3AINCLUDED)))))&sessionId=6Ttoe2KSQempNC5Dh0X9VQ%3D%3D',
          'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'x-li-identity': 'dXJuOmxpOmVudGVycHJpc2VQcm9maWxlOih1cm46bGk6ZW50ZXJwcmlzZUFjY291bnQ6MjM1NDg5MzEzLDM0MzA4MTEyMyk',
          'x-li-lang': 'en_US',
          'x-li-page-instance': 'urn:li:page:d_sales2_search_company;n/oaZmu8Q/usIRYQJbtBfA==',
          'x-li-track': '{"clientVersion":"2.0.1108","mpVersion":"2.0.1108","osName":"web","timezoneOffset":5.5,"timezone":"Asia/Calcutta","deviceFormFactor":"DESKTOP","mpName":"lighthouse-web","displayDensity":2,"displayWidth":3360,"displayHeight":2100}',
          'x-restli-protocol-version': '2.0.0'
        }
    });

  console.log(JSON.stringify(response.data, null, 4));
}

linkedinScrapere();