// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Tooltip } from 'antd';
import React from 'react';
import announcedIcon from 'src/assets/parachains/announced.png';
import auctionIcon from 'src/assets/parachains/auction.png';
import liveIcon from 'src/assets/parachains/chain-link.png';
import githubLogo from 'src/assets/parachains/github.png';
import testingIcon from 'src/assets/parachains/testing.png';
import w3fBlackLogo from 'src/assets/parachains/w3f-black.png';
import w3fGreenLogo from 'src/assets/parachains/w3f-green.png';
import w3fRedLogo from 'src/assets/parachains/w3f-red.png';

interface AllParachainsCardProps {
	index: number | string,
	className?: string
	badgeArray: string[]
	githubLink: string
	investors: number
	logoURL: string
	project: string
	status: string
	token: string
	chain?: string
	tokenPriceUSD?: number
	w3fGrant: { [key: string]: any; } | null
}

const Cards = function ({
	className,
	// id,
	badgeArray,
	githubLink,
	investors,
	logoURL,
	project: name,
	status,
	token,
	w3fGrant
}:AllParachainsCardProps) {

	function toTitleCase(str: string): string {
		return str.replace(
			/\w\S*/g,
			function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
			}
		);
	}

	const grantPopupContent = () => {
		let content = '';
		if(w3fGrant){
			if(w3fGrant.terminated){
				content = toTitleCase(`W3F grant TERMINATED: "${w3fGrant.terminationReason}"`);
			}else if(w3fGrant.milestoneText){
				content = toTitleCase(`${w3fGrant.received} received, ${w3fGrant.milestoneText}`);
			}else{
				content = toTitleCase(`${w3fGrant.received} received, ${w3fGrant.completed} completed`);
			}
		}else {
			content = '';
		}
		return content;
	};

	const title = grantPopupContent();

	return (
		<div className={className}>
			<div className='parachain-card-header'>
				<div>
					<img src={logoURL} height={34} width={34} alt={`${name} Logo`} />
					<span className='project-name'>{name}</span>
				</div>
				<a href={githubLink} target='_blank' rel='noreferrer'>
					<img src={githubLogo} height={16} width={16} alt="Github" />
				</a>
			</div>

			<div className="parachain-card-meta">
				<div className="div1">
					<h3>Tokens</h3>
					<p>{token == '' ? 'N/A' : token}</p>
				</div>
				<div className="div2">
					<h3>Investors</h3>
					<p>{investors == 0 ? 'N/A' : investors }</p>
				</div>
				<div className="div3">
					<h3>Status</h3>
					<p className="status">
						{
							status.search('auction') !== -1 ? <><img src={auctionIcon} height={12} width={12} alt='Auction Icon' /> In Auction</>:
								status.search('Testing') !== -1 ? <><img src={testingIcon} height={12} width={12} alt='Testing Icon' /> Testing</> :
									status.search('announced') !== -1 ? <><img src={announcedIcon} height={12} width={12} alt='Announced Icon' /> Announced</>:
										status.search('live') !== -1 ? <><img src={liveIcon} height={12} width={12} alt='Live Icon' /> Live</> : null
						}
					</p>
				</div>
				<div className="div4">
					<h3>W3F Grant</h3>
					<div>
						{ w3fGrant ?
							<div className="grant-data-div">
								<Tooltip title={title}>
									<img src={w3fGrant?.terminated ? w3fRedLogo : w3fGrant?.milestoneText? w3fBlackLogo : w3fGreenLogo} height={34} width={34} alt='W3F Logo' />
								</Tooltip>
							</div>
							: 'N/A'
						}
					</div>
				</div>
			</div>

			<div className="parachain-card-tags">
				<div className='project-badges'>
					{badgeArray.map(
						(badge: string) => {
							return <div key={badge} style={{ backgroundColor:'#EA729D', borderRadius:'48px', color:'#ffffff', marginRight:'10px', padding:'4px 10px' }}>{badge}</div>;
						}
					)}
				</div>
			</div>
		</div>
	);
};

export default styled(Cards)`
	text-transform: capitalize !important;
	background: #fff;
	width: 98%;
	margin-top: 16px;
	margin-right: auto;
	margin-left: auto;
	padding: 16px 16px 16px 16px;
	border-radius: 10px;
	border: 1px solid #D5DBDE;

	.parachain-card-header {

		&, div {
			display: flex;
		}

		justify-content: space-between;

		align-items: center;
		color: #75767C;

		img { 
			margin-right: 10px;
		}

		.project-name {
			font-size: 16px;
		}
	}

	.parachain-card-meta {
		margin-top: 16px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		grid-column-gap: 40px;
		grid-row-gap: 16px;
		color: #3B444F;

		.div1 { grid-area: 1 / 1 / 2 / 2; }
		.div2 { grid-area: 1 / 2 / 2 / 3; }
		.div3 { grid-area: 2 / 1 / 3 / 2; }
		.div4 { grid-area: 2 / 2 / 3 / 3; }

		h3 {
			font-size: 12px;
			margin-bottom: 11px;
			font-weight: 500;
		}

		p, div {
			font-size: 14px;

			&.status {
				display: flex;
				align-items: center;

				img {
					margin-right: 4px;
				}
			}

			.grant-data-div {
				display: flex;
				align-items: start;
				white-space: pre-wrap;
				img {
					margin-top: 2px;
				}

				.grant-text {
					margin-left: 6px;
					font-weight: 500;

					&.red-text {
						color: #F51D2C !important;
					}

					&.green-text {
						color: #52C41A !important;
					}
				}
			}
		}
	}
	
	.parachain-card-tags {
		margin-top: 20px;

		h3 {
			font-weight: 700 !important;
			font-size: 12px !important;
			margin-bottom: 0;
		}

		.project-badges{
			display: flex;
			overflow-x: auto;
			max-width: 100% !important;

			@media only screen and (max-width: 767px) {
				overflow-x: auto;
				background: transparent !important;
				-ms-overflow-style: none;  /* Internet Explorer 10+ */
				scrollbar-width: none;  /* Firefox */

				&::-webkit-scrollbar {
					display: none;  /* Safari and Chrome */
				}
			}
			
		}
	}

	.project-token-cell>div {
		display: flex;
		align-content: center;
	}

	.text-capitalize {
		text-transform: capitalize !important;
	}
`;
