
function l3AccountCheck(email) {
	if (email === 'odb@ioniqsciences.com')
		return {key: '12ae9e38-d824-43c3-a16a-01193a7384f3', name: 'Owen', role: 'IONIQ Operator'};
	if (email === 'kgl@ioniqsciences.com')
		return {key: 'fbb0a563-5185-474c-9f11-82cdd1ab7e0b', name: 'Kyle', role: 'IONIQ Operator'};
	if (email === 'mag@ioniqsciences.com')
		return {key: '751df56d-219f-4a33-868a-a6dbaa575a93', name: 'Operator', role: 'IONIQ Operator'};
	if (email === 'jbb@ioniqsciences.com')
		return {key: 'c14f0ecd-fc9f-4e8e-b43d-ef8796912bbb', name: 'Operator', role: 'IONIQ Operator'};
	if (email === 'acr@ioniqsciences.com')
		return {key: 'f2b32060-6efb-4d49-af19-fdbb5f22548c', name: 'Operator', role: 'IONIQ Operator'};
	if (email === 'aaron@ici-coatings.com')
		return {key: '7112390b-1a94-494a-9871-d9de3f970d94', name: 'Operator', role: 'IONIQ Operator'};
	if (email === 'don@vineapp.com')
		return {key: '3545bf3c-5f60-4393-97be-d6d7c7f82af6', name: 'Don', role: 'IONIQ Operator'};

		
	return undefined;
}