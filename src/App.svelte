<script>
	import {onMount, setContext} from 'svelte';
	import moment from 'moment';
	import {formatNumber} from 'ketrics-utils/Formatter';
	import {options} from './Common';
	import {ContextKey} from './Context';

	// Standard Components
    import * as Form from 'ketrics-ui-svelte/src/components/Form';
    import {Modal, Notification} from 'ketrics-ui-svelte/src/components';

    // Custom Components
    import FormCreateEdit from './components/FormCreateEdit.svelte';
    import FormConfirmDelete from './components/FormConfirmDelete.svelte';
    import FormProcessExcel from './components/FormProcessExcel.svelte';

	export let ketricsApplication;
	export let ketricsService;

	let loading=false,
	    parameters={},
	    items=[],
	    refs={},
	    selected;

	setContext(ContextKey, {});

	onMount(async()=>{
	    await handleSubmit()
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
            await ketricsService.setup();
            Notification.success({message: 'Setup Successfull!'});
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
	}

	function handleItemSaved({detail: item}){
	    const index = items.findIndex($item=>$item.id===item.id);
	    if(index===-1){
            items = [item, ...items];
        }else{
            items[index] = item;
        }
	}

    function handleItemDeleted({detail: id}){
        items = items.filter($item=>$item.id!==id);
	}

	function handleFileProcessed({detail: item}){
	    const index = items.findIndex($item=>$item.id===item.id);
        items[index] = item;
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
                        <button class="button is-success" on:click={()=>refs.formCreateEdit.add()}>Add</button>
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

<FormCreateEdit {ketricsService}
                bind:this={refs.formCreateEdit}
                on:itemSaved={handleItemSaved}
/>

<FormConfirmDelete {ketricsService}
                   bind:this={refs.formDelete}
                   on:itemDeleted={handleItemDeleted}
/>

<FormProcessExcel {ketricsService}
                  bind:this={refs.formProcessFile}
                  on:fileProcessed={handleFileProcessed}
/>
