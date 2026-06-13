declare const apiRoutes: import("hono/hono-base").HonoBase<
	import("hono/types").BlankEnv,
	| import("hono/types").BlankSchema
	| import("hono/types").MergeSchemaPath<
			{
				"/": {
					$post:
						| {
								input: {
									json: {
										fingerprint: string;
										version: string;
										device: {
											manufacturer: string;
											model: string;
											brand: string;
											os_version: string;
										};
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										fingerprint: string;
										version: string;
										device: {
											manufacturer: string;
											model: string;
											brand: string;
											os_version: string;
										};
									};
								};
								output: {
									banned: true;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										fingerprint: string;
										version: string;
										device: {
											manufacturer: string;
											model: string;
											brand: string;
											os_version: string;
										};
									};
								};
								output: {
									banned: false;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  };
				};
			},
			"/api/v1/auth"
	  >
	| import("hono/types").MergeSchemaPath<
			{
				"/health": {
					$get: {
						input: {};
						output: {
							status: string;
						};
						outputFormat: "json";
						status: import("hono/utils/http-status").ContentfulStatusCode;
					};
				};
			} & {
				"/event": {
					$post: {
						input: {
							json: {
								[x: string]: any;
								type: string;
								fingerprint: string;
								version: string;
								device: {
									manufacturer: string;
									model: string;
									brand: string;
									os_version: string;
								};
								message?: string | undefined;
							};
						};
						output: {
							status: string;
						};
						outputFormat: "json";
						status: import("hono/utils/http-status").ContentfulStatusCode;
					};
				};
			},
			"/api/v1/analytics"
	  >
	| import("hono/types").MergeSchemaPath<
			{
				"/login": {
					$post:
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 401;
						  }
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
									};
								};
								output: {
									success: true;
									token: string;
									user: {
										name: string;
										id: string;
										fingerprint: string | null;
										phone: string;
										accountType: "low" | "savings";
										biometricLogin: boolean;
										premium: boolean;
										createdAt: string;
										updatedAt: string;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/register": {
					$post:
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
										name: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
										name: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  }
						| {
								input: {
									json: {
										phone: string;
										fingerprint: string;
										pin: string;
										name: string;
									};
								};
								output: {
									success: true;
									user: {
										user: {
											name: string;
											id: string;
											fingerprint: string | null;
											phone: string;
											accountType: "low" | "savings";
											biometricLogin: boolean;
											createdAt: string;
											updatedAt: string;
										};
										wallet: {
											id: string;
											createdAt: string;
											updatedAt: string;
											userId: string;
											available: number;
										};
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  };
				};
			} & {
				"/check-phone": {
					$post:
						| {
								input: {
									json: {
										phone: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										phone: string;
									};
								};
								output: {
									exists: true;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										phone: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/logout": {
					$post: {
						input: {};
						output: {
							success: true;
							message: string;
						};
						outputFormat: "json";
						status: import("hono/utils/http-status").ContentfulStatusCode;
					};
				};
			},
			"/api/v2/auth"
	  >
	| import("hono/types").MergeSchemaPath<
			{
				"/": {
					$get:
						| {
								input: {};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {};
								output: {
									success: true;
									wallet: {
										id: string;
										createdAt: string;
										updatedAt: string;
										userId: string;
										available: number;
										pockets: {
											name: string;
											id: string;
											createdAt: string;
											updatedAt: string;
											walletId: string;
											amount: number;
										}[];
										transactions: {
											name: string;
											type:
												| "deposit"
												| "withdraw"
												| "income"
												| "transfer"
												| "transfer.p2p"
												| "transfer.breb"
												| "transfer.bank";
											message: string | null;
											id: string;
											date: string;
											phone: string | null;
											accountType: "ahorro" | "corriente" | null;
											createdAt: string;
											walletId: string;
											amount: number;
											bank: string | null;
										}[];
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/deposit": {
					$post:
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									success: true;
									transaction: {
										name: string;
										type:
											| "deposit"
											| "withdraw"
											| "income"
											| "transfer"
											| "transfer.p2p"
											| "transfer.breb"
											| "transfer.bank";
										message: string | null;
										id: string;
										date: string;
										phone: string | null;
										accountType: "ahorro" | "corriente" | null;
										createdAt: string;
										walletId: string;
										amount: number;
										bank: string | null;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/withdraw": {
					$post:
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									success: true;
									transaction: {
										name: string;
										type:
											| "deposit"
											| "withdraw"
											| "income"
											| "transfer"
											| "transfer.p2p"
											| "transfer.breb"
											| "transfer.bank";
										message: string | null;
										id: string;
										date: string;
										phone: string | null;
										accountType: "ahorro" | "corriente" | null;
										createdAt: string;
										walletId: string;
										amount: number;
										bank: string | null;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: any;
								};
								outputFormat: "json";
								status: 400 | 500;
						  };
				};
			} & {
				"/income": {
					$post:
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									success: true;
									transaction: {
										name: string;
										type:
											| "deposit"
											| "withdraw"
											| "income"
											| "transfer"
											| "transfer.p2p"
											| "transfer.breb"
											| "transfer.bank";
										message: string | null;
										id: string;
										date: string;
										phone: string | null;
										accountType: "ahorro" | "corriente" | null;
										createdAt: string;
										walletId: string;
										amount: number;
										bank: string | null;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										name: string;
										amount: number;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/transfer": {
					$post:
						| {
								input: {
									json:
										| {
												type: "transfer";
												phone: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.p2p";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.breb";
												phone: string;
												bank: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.bank";
												phone: string;
												accountType: "ahorro" | "corriente";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  };
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									json:
										| {
												type: "transfer";
												phone: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.p2p";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.breb";
												phone: string;
												bank: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.bank";
												phone: string;
												accountType: "ahorro" | "corriente";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  };
								};
								output: {
									success: true;
									wallet: {
										id: string;
										createdAt: string;
										updatedAt: string;
										userId: string;
										available: number;
									};
									transaction: {
										name: string;
										type:
											| "deposit"
											| "withdraw"
											| "income"
											| "transfer"
											| "transfer.p2p"
											| "transfer.breb"
											| "transfer.bank";
										message: string | null;
										id: string;
										date: string;
										phone: string | null;
										accountType: "ahorro" | "corriente" | null;
										createdAt: string;
										walletId: string;
										amount: number;
										bank: string | null;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json:
										| {
												type: "transfer";
												phone: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.p2p";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.breb";
												phone: string;
												bank: string;
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  }
										| {
												type: "transfer.bank";
												phone: string;
												accountType: "ahorro" | "corriente";
												name: string;
												amount: number;
												message?: string | undefined;
												date?: number | undefined;
										  };
								};
								output: {
									error: any;
								};
								outputFormat: "json";
								status: 400 | 500;
						  };
				};
			} & {
				"/transaction/:id": {
					$get:
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									success: true;
									transaction: {
										id: string;
										walletId: string;
										name: string;
										type:
											| "deposit"
											| "withdraw"
											| "income"
											| "transfer"
											| "transfer.p2p"
											| "transfer.breb"
											| "transfer.bank";
										amount: number;
										date: string;
										phone: string | null;
										message: string | null;
										bank: string | null;
										accountType: "ahorro" | "corriente" | null;
										createdAt: string;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/transaction/:id": {
					$delete:
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									success: true;
									message: string;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									param: {
										id: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			},
			"/api/v2/wallet"
	  >
	| import("hono/types").MergeSchemaPath<
			{
				"/profile": {
					$get:
						| {
								input: {};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {};
								output: {
									success: true;
									user: {
										name: string;
										id: string;
										fingerprint: string | null;
										phone: string;
										accountType: "low" | "savings";
										biometricLogin: boolean;
										premium: boolean;
										createdAt: string;
										updatedAt: string;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/name": {
					$patch:
						| {
								input: {
									json: {
										name: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										name: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 404;
						  }
						| {
								input: {
									json: {
										name: string;
									};
								};
								output: {
									success: true;
									user: {
										name: string;
										id: string;
										fingerprint: string | null;
										phone: string;
										accountType: "low" | "savings";
										biometricLogin: boolean;
										premium: boolean;
										createdAt: string;
										updatedAt: string;
									};
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										name: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/pin": {
					$patch:
						| {
								input: {
									json: {
										currentPin: string;
										newPin: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										currentPin: string;
										newPin: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 401;
						  }
						| {
								input: {
									json: {
										currentPin: string;
										newPin: string;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  }
						| {
								input: {
									json: {
										currentPin: string;
										newPin: string;
									};
								};
								output: {
									success: true;
									message: string;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  };
				};
			} & {
				"/biometric": {
					$patch:
						| {
								input: {
									json: {
										biometricLogin: boolean;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 400;
						  }
						| {
								input: {
									json: {
										biometricLogin: boolean;
									};
								};
								output: {
									success: true;
									biometricLogin: boolean;
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										biometricLogin: boolean;
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			} & {
				"/account-type": {
					$patch:
						| {
								input: {
									json: {
										accountType: "low" | "savings";
									};
								};
								output: {
									success: true;
									accountType: "low" | "savings";
								};
								outputFormat: "json";
								status: import("hono/utils/http-status").ContentfulStatusCode;
						  }
						| {
								input: {
									json: {
										accountType: "low" | "savings";
									};
								};
								output: {
									error: string;
								};
								outputFormat: "json";
								status: 500;
						  };
				};
			},
			"/api/v2/user"
	  >,
	"/",
	"/"
>;
declare const _default: {
	fetch: (
		request: Request,
		Env?: unknown,
		executionCtx?: import("hono").ExecutionContext,
	) => Response | Promise<Response>;
	port: number;
};
export default _default;
export type ApiRoutes = typeof apiRoutes;
//# sourceMappingURL=index.d.ts.map
