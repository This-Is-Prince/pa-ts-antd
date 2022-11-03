// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Alert } from 'antd';
import React from 'react';
import cleanError from 'src/util/cleanError';

interface Props {
	className?: string;
	errorMsg: string;
}

const ErrorAlert = ({ className, errorMsg } : Props) => {
	return (
		<Alert message={cleanError(errorMsg)} type="error" className={className} />
	);
};

export default ErrorAlert;