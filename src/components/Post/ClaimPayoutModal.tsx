// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Alert, Button, Modal, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { APPNAME } from 'src/global/appName';
import { NotificationStatus } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import queueNotification from 'src/ui-components/QueueNotification';

interface Props {
	className?: string;
	parentBountyId:number | undefined;
	childBountyId:number | undefined;
}

const ClaimPayoutModal = ({ className, parentBountyId, childBountyId } : Props) => {
	const { api, apiReady } = useContext(ApiContext);

	const [showModal, setShowModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [availableAccounts, setAvailableAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState<boolean>(false);
	const [selectedAddress, setSelectedAddress] = useState<string>('');

	const getAccounts = async () => {
		setIsLoading(true);
		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			setIsLoading(false);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const allAccounts = await web3Accounts();
		setAvailableAccounts(allAccounts);
		setIsLoading(false);
	};

	useEffect(() => {
		getAccounts();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onAccountChange = (e: any, address:string) => {
		setSelectedAddress(address);
	};

	const handleSignAndSubmit = async () => {
		if(!selectedAddress || !parentBountyId || !childBountyId || isLoading) return;

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const injected = await web3FromSource(availableAccounts[0].meta.source);

		api.setSigner(injected.signer);

		setIsLoading(true);

		try {
			const claim = api.tx.childBounties.claimChildBounty(parentBountyId, childBountyId);
			claim.signAndSend(selectedAddress, ({ status }) => {
				if (status.isInBlock) {
					queueNotification({
						header: 'Success!',
						message: ' Claim Payout successful.',
						status: NotificationStatus.SUCCESS
					});
					console.log(`Completed at block hash #${status.asInBlock.toString()}`);
				} else {
					console.log(`Current status: ${status.type}`);
				}
				setIsLoading(false);
				setShowModal(false);
			}).catch((error) => {
				setIsLoading(false);
				console.log(':( transaction failed');
				console.error('ERROR:', error);
				setShowModal(false);
				queueNotification({
					header: 'Payout Claim Failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
			});
		}
		catch(error){
			setIsLoading(false);
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			setShowModal(false);
			queueNotification({
				header: 'Payout Claim Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		}
	};

	return (
		<div className={className}>
			<Button
				className='bg-pink_primary hover:bg-pink_secondary text-base text-white border-pink_primary hover:border-pink_primary rounded-md inline'
				onClick={() => setShowModal(true)}
			>
				Claim Payout
			</Button>
			<Modal
				title="Confirm Payout Claim"
				open={showModal}
				onCancel={() => setShowModal(false)}
				footer={[
					<Button className='bg-pink_primary text-white border-pink_primary hover:bg-pink_secondary' key="second" onClick={handleSignAndSubmit} loading={isLoading} disabled={extensionNotAvailable || !apiReady}>
            Sign &amp; Submit
					</Button>
				]}
			>
				<Spin spinning={isLoading} indicator={<LoadingOutlined />}>

					<Alert className='mb-6' type='success' message='Thank you for your work to support the community. Please submit the transaction to claim the transaction.' />

					{extensionNotAvailable && <Alert className='mb-6' type='warning' message='Please install polkadot.js extension to claim.' />}

					{!extensionNotAvailable &&
					<>
						<AccountSelectionForm
							title='Please select your account'
							accounts={availableAccounts}
							address={selectedAddress}
							withBalance
							onAccountChange={onAccountChange}
						/>
					</>
					}
				</Spin>
			</Modal>
		</div>
	);
};

export default ClaimPayoutModal;