// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Alert, Button, Form, Input } from 'antd';
import React, { FC, useContext } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useLoginMutation } from 'src/generated/graphql';
import { handleTokenChange } from 'src/services/auth.service';
import { Wallet } from 'src/types';
import FilteredError from 'src/ui-components/FilteredError';
import messages from 'src/util/messages';
import * as validation from 'src/util/validation';

import WalletButtons from './WalletButtons';

interface Props {
  onWalletSelect: (wallet: Wallet) => void;
  walletError: string | undefined;
}
const Web2Login: FC<Props> = ({ walletError, onWalletSelect }) => {
	const navigate = useNavigate();
	const currentUser = useContext(UserDetailsContext);
	const [loginMutation, { error, loading }] = useLoginMutation();
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const handleSubmitForm = (data: Record<string, any>): void => {
		const { username, password } = data;

		if (username && password) {
			loginMutation({
				variables: {
					password,
					username
				}
			})
				.then(({ data }) => {
					if (data && data.login && data.login.token) {
						handleTokenChange(data.login.token, currentUser);
						navigate(-1);
					}
				})
				.catch((e) => {
					console.error('Login error', e);
				});
		}
	};
	return (
		<article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6 md:min-w-[500px]">
			<h3 className="text-2xl font-semibold text-[#1E232C]">Login</h3>
			{walletError && <Alert message={walletError} type="error" />}
			<Form
				onFinish={handleSubmit(handleSubmitForm)}
				className="flex flex-col gap-y-6"
			>
				<div className="flex flex-col gap-y-1">
					<label
						className="text-base text-sidebarBlue font-medium"
						htmlFor="username"
					>
                        Username
					</label>
					<Controller
						control={control}
						rules={validation.username}
						name="username"
						render={({ field }) => (
							<Input
								{...field}
								placeholder="John"
								className="rounded-md py-3 px-4"
								id="username"
							/>
						)}
					/>
					{(errors.username as FieldError)?.type === 'maxLength' && (
						<span className="text-red_secondary mt-1">
							{messages.VALIDATION_USERNAME_MAXLENGTH_ERROR}
						</span>
					)}
					{(errors.username as FieldError)?.type === 'minLength' && (
						<span className="text-red_secondary mt-1">
							{messages.VALIDATION_USERNAME_MINLENGTH_ERROR}
						</span>
					)}
					{(errors.username as FieldError)?.type === 'pattern' && (
						<span className="text-red_secondary mt-1">
							{messages.VALIDATION_USERNAME_PATTERN_ERROR}
						</span>
					)}
					{(errors.username as FieldError)?.type === 'required' && (
						<span className="text-red_secondary mt-1">
							{messages.VALIDATION_USERNAME_REQUIRED_ERROR}
						</span>
					)}
				</div>
				<div className="flex flex-col gap-y-1">
					<label
						className="text-base text-sidebarBlue font-medium"
						htmlFor="password"
					>
                        Password
					</label>
					<Controller
						control={control}
						rules={validation.password}
						name="password"
						render={({ field }) => (
							<Input.Password
								{...field}
								placeholder="Password"
								className="rounded-md py-3 px-4"
								id="password"
							/>
						)}
					/>
					{errors.password && (
						<span className="text-red_secondary mt-1">
							{messages.VALIDATION_PASSWORD_ERROR}
						</span>
					)}
					<div className="text-right text-pink_primary my-3">
						<Link to="/request-reset-password">Forgot Password?</Link>
					</div>
				</div>
				<div className="flex justify-center items-center">
					<Button
						htmlType="submit"
						size="large"
						className="bg-pink_primary w-56 rounded-md outline-none border-none text-white"
					>
                        Login
					</Button>
				</div>
				<div>{error?.message && <FilteredError text={error.message} />}</div>

				<div>
					<WalletButtons disabled={loading} onWalletSelect={onWalletSelect} />
				</div>

				<div className='flex justify-center items-center gap-x-2 font-semibold'>
					<label className='text-md text-grey_primary'>Don&apos;t have an account?</label>
					<Link to='/signup' className='text-pink_primary text-md'>
                        Sign Up
					</Link>
				</div>
			</Form>
		</article>
	);
};

export default Web2Login;
