<script>
	import {onMount} from 'svelte';
	import moment from 'moment';
	import {formatNumber} from 'ketrics-utils/Formatter'

    import * as Form from 'ketrics-ui-svelte/src/components/Form';
    import {Modal, Notification} from 'ketrics-ui-svelte/src/components';

	export let ketricsApplication;
	export let ketricsService;


	let loading=false,
	    parameters={
	    },
	    options={
	    },
	    items=[],
	    refs={},
	    openForm=false,
	    openUploadForm=false,
	    form={},
	    fileInput = {name:''},
	    selected;

	onMount(()=>{
	    handleSubmit()
	})

	async function handleSubmit(){
	    loading = true;
        try{
            const response = await ketricsService.runHandler('fetchData', parameters);
            items = response.items.data;
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
	}

	async function handleSetup(){
	    loading = true;
        try{
            const response = await ketricsService.runHandler('setup');
            Notification.success({message: 'Setup Successfull!'});
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
	}

	function handleAdd(){
	    form = {
	    }

	    openForm=true;
	}

	function handleCloseForm(){
	    openForm=false;
	}

	async function handleSave(){
	    loading = true;
        try{
            const response = await ketricsService.runHandler('save', form);
            let item = response.items.data[0];
            if(form.id_operacion===null){
                items = [item, ...items];
            }else{
                const index = items.findIndex(item=>item.id===form.id);
                items[index] = item;
            }
            Notification.success({message: 'Item Saved!'});
            openForm=false;
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
	}

	function handleEdit(index){
	    form = items[index];
	    openForm=true;
	}

	function handleCloseUploadForm(){
	    openUploadForm = false;
	}

	async function handleUploadFile(){
        loading=true;
        try{
            const formData = new FormData();
            formData.append('file', fileInput);
            const data = await ketricsService.readExcel(formData);
            await processData(data);
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error'});
        }
        loading=false;
	}

    function handleChangeFile(e){
        fileInput = e.target.files[0];
    }

    function validateObj(obj){
	    return true;
    }

	async function processData(data){
        let lines = data['Hoja1'].split("\n");
        let re = /RegExp/g;
        let headerIndex = lines.findIndex(line=>line.search(re)===1);
        const headers = lines[headerIndex].split("|");

        headers.forEach((key, index)=>{
            headers[index] = key === "" ? "col"+index: key.toLowerCase().trim();
        })

        let newData=[];
        lines.slice(headerIndex+1).forEach(line=>{
            let values = line.split("|");
            let obj = headers.reduce((obj, k, i) => ({...obj, [k]: values[i] }), {});

            if(validateObj(obj)){
                newData.push({

                });
            }
        });

        loading = true;
        try{
            const response = await ketricsService.runHandler('saveDetail', {
                id: selected.id,
                detail: newData
            });
            let item = response.item.data[0];
            const index = items.findIndex(obj=>obj.id===item.id);
            items[index] = item;
            Notification.success({message: 'Saved!'});
            handleCloseUploadForm();
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;

	}

	function handleOpenUploadForm(index){
	    selected = items[index];
	    fileInput = {name:''};
	    openUploadForm = true;
	}

	$: disabled = loading ? {disabled:true}:{};
</script>

<style>
    .app-container{
        padding: 10px
    }

    .filters{
        display: flex;
    }

    .filter{
        margin-right: 10px;
    }

    .buttons-container{
        padding-top:32px;
        display: flex;
    }
    .buttons-container .control{
        margin-right: 10px;
    }

</style>

<div class="app-container">
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                Filtros
            </p>
            <a href="javascript:void(0);" class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </a>
        </header>
        <div class="card-content">
            <div class="content filters">
                <div class="filter" style="width: 120px">
                    <Form.FormField label="Year">
                        <Form.InputNumber bind:value={parameters.year}
                                          placeholder="YYYY"
                        />
                    </Form.FormField>
                </div>
                <div class="buttons-container">
                    <div class="control">
                        <button class="button is-info" on:click={handleSubmit}>Submit</button>
                    </div>

                    <div class="control">
                        <button class="button is-success" on:click={handleAdd}>Add</button>
                    </div>

                    <div class="control">
                        <button class="button is-danger" on:click={handleSetup}>Setup</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {#if items.length > 0 }
        <table class="table is-fullwidth is-narrow">
            <thead>
                <tr>
                </tr>
            </thead>
            <tbody>
                {#each items as item,indexItem}
                    <tr>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}

</div>

{#if openForm}
    <Modal onClose={handleCloseForm}>
        <h3 class="title">Form</h3>


        <div class="buttons is-right">
            <button class="button is-info"
                    class:is-loading={loading}
                    {...disabled}
                    on:click={handleSave}
            >
                Save
            </button>
        </div>
    </Modal>
{/if}


{#if openUploadForm}
    <Modal onClose={handleCloseUploadForm}>
        <h3 class="is-3">Upload Dashboards Settings</h3>

        <div class="field">
        <div class="file is-info has-name is-fullwidth">
            <label class="file-label">
            <input class="file-input" type="file" name="settings" on:change={e=>handleChangeFile(e)} >
            <span class="file-cta">
                <span class="file-icon">
                <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                Info file…
                </span>
            </span>
            <span class="file-name">
                {fileInput.name}
            </span>
            </label>
        </div>
        </div>

        <div class="buttons is-right">
            <span class="button is-info"
                  class:is-loading={loading}
                  {...disabled}
                  on:click={handleUploadFile}
            >
                Upload
            </span>
            <span class="button" on:click={handleCloseUploadForm}>Cancel</span>
        </div>
    </Modal>
{/if}
