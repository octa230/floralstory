'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import Link from 'next/link';
import { URL } from '../../../../constants'


const VerifyAccount = () => {
  const params = useParams();
    const{token, userId } = params

  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: 'Verifying your account...',
  });

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        if (!token) {
          setVerificationStatus({
            loading: false,
            success: false,
            message: 'Missing verification token. Please check your email link.',
          });
          return;
        }

        const response = await axios.post(
          `${URL}/auth/verify/${userId}/${token}`
        );

        setVerificationStatus({
          loading: false,
          success: true,
          message: 'Your account has been successfully verified! You can now login.',
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Verification failed. Please try again or contact support.';
        setVerificationStatus({
          loading: false,
          success: false,
          message: errorMessage,
        });
      }
    };

    verifyAccount();
  }, [token, userId]);

  return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Account Verification</h1>

        {verificationStatus.loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-center">{verificationStatus.message}</p>
          </div>
        ) : (
          <div className="text-center">
            {verificationStatus.success ? (
              <>
                <div className="">
                  <MDBIcon name='check' color='black' size='100'/>
                </div>
                <h2 className="text-lg font-medium text-green-600 mb-4">Verification Successful!</h2>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-red-600 mb-4">Verification Failed</h2>
              </>
            )}

            <p className="text-gray-600 mb-6">{verificationStatus.message}</p>

            <div className="flex justify-center">
              {verificationStatus.success ? (
                <MDBBtn href="/login" className="">
                  Go to Login
                </MDBBtn>
              ) : (
                <Link
                  href="/resend-verification"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Resend Verification Email
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

export default VerifyAccount;